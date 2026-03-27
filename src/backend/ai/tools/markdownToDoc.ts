import { tool } from 'ai';
import { z } from 'zod';
import { google } from 'googleapis';
import { marked } from 'marked';

export const createDocFromMarkdownSchema = z.object({
  title: z.string().describe('The title of the new Google Doc'),
  markdownContent: z.string().describe('The Markdown string to convert into the document'),
});

export const formatMarkdownInDocSchema = z.object({
  documentUrl: z.string().describe('The URL of the Google Doc to format'),
});

// Helper to get Google Auth
async function getGoogleAuth(env: Env) {
  const pt1 = await env.GOOGLE_CREDS_SA_PRIVATE_KEY_PT_1.get();
  const pt2 = await env.GOOGLE_CREDS_SA_PRIVATE_KEY_PT_2.get();
  const rawKey = pt1 + pt2;

  let auth;
  try {
    const parsed = JSON.parse(rawKey);
    auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: parsed.client_email,
        private_key: parsed.private_key,
      },
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive'
      ],
    });
  } catch (e) {
    auth = new google.auth.JWT({
      email: 'service-account@example.com',
      key: rawKey.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive'
      ],
    });
  }
  return auth;
}

export async function createDocFromMarkdown(env: Env, title: string, markdownContent: string) {
  const auth = await getGoogleAuth(env);
  const drive = google.drive({ version: 'v3', auth });

  // Convert markdown to HTML
  const htmlContent = marked.parse(markdownContent);

  // Upload HTML as a Google Doc
  const response = await drive.files.create({
    requestBody: {
      name: title,
      mimeType: 'application/vnd.google-apps.document',
    },
    media: {
      mimeType: 'text/html',
      body: htmlContent as string,
    },
    fields: 'id, name, webViewLink',
  });

  return {
    documentId: response.data.id,
    title: response.data.name,
    url: response.data.webViewLink,
  };
}

/**
 * Create Google Doc from Markdown Tool
 */
export const createDocFromMarkdownTool = (env: Env) =>
  tool({
    description: 'Create a new Google Doc properly formatted from a Markdown string.',
    parameters: createDocFromMarkdownSchema,
    execute: async ({ title, markdownContent }) => {
      try {
        const result = await createDocFromMarkdown(env, title, markdownContent);
        return {
          success: true,
          message: `Successfully created formatted Google Doc "${title}".`,
          data: result
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  });


export async function formatMarkdownInDoc(env: Env, documentUrl: string) {
  const auth = await getGoogleAuth(env);
  const drive = google.drive({ version: 'v3', auth });

  const idMatch = documentUrl.match(/[-\w]{25,}/);
  if (!idMatch) {
    throw new Error(`Invalid Google Doc URL provided: ${documentUrl}`);
  }
  const documentId = idMatch[0];

  // Export the document as plain text to analyze it with AI
  // Wait, if we export as text, we lose existing formatting!
  // The user states: "could mean a mixture of properly formatted doc content blended in with paragraphs of markdown ... magically handle anything"
  // If we export as HTML, the markdown asterisks/hashes will just be text nodes in HTML.
  // We can pass the exported HTML to an LLM, asking it to detect markdown syntax within the text nodes,
  // and rewrite the entire HTML payload replacing the markdown syntax with proper HTML tags (<b>, <h1>, etc).
  // Then we update the Google Doc with the new HTML payload.

  // 1. Export as HTML
  let exportedHtml: string;
  try {
    const exportResponse = await drive.files.export({
      fileId: documentId,
      mimeType: 'text/html'
    });
    exportedHtml = exportResponse.data as unknown as string;
  } catch (error) {
    console.error("Failed to export doc", error);
    throw new Error(`Failed to export document. Ensure the service account has read access to the file.`);
  }

  // 2. Use LLM to magically fix the mixture
  const apiKey = await env.OPENAI_API_KEY.get();
  const gatewayUrl = env.AI.gateway('workspace-agent').url('universal');

  // We'll use fetch directly against the OpenAI-compatible gateway
  const chatResponse = await fetch(`${gatewayUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an HTML and Markdown parsing assistant. The user will provide you with an HTML string that represents a Google Document. This document contains a mixture of properly formatted HTML and raw Markdown syntax (like **, #, [], etc). Your job is to carefully parse the HTML, find any raw Markdown syntax within the text nodes, and convert that Markdown into proper HTML formatting, blending it seamlessly with the existing HTML. Return ONLY the final, clean, valid HTML string. Do not wrap the output in markdown code blocks. Just output the raw HTML string.'
        },
        {
          role: 'user',
          content: exportedHtml
        }
      ]
    })
  });

  if (!chatResponse.ok) {
    const errText = await chatResponse.text();
    throw new Error(`AI processing failed: ${chatResponse.status} ${errText}`);
  }

  const aiResult = await chatResponse.json() as any;
  let fixedHtml = aiResult.choices[0].message.content;

  // Cleanup if LLM added markdown code block formatting
  if (fixedHtml.startsWith('```html')) {
    fixedHtml = fixedHtml.replace(/^```html\n/, '').replace(/\n```$/, '');
  } else if (fixedHtml.startsWith('```')) {
    fixedHtml = fixedHtml.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  // 3. Update the Google Doc by uploading the fixed HTML
  // To replace a doc's content using Drive API, we use files.update with the new media body
  // Note: updating a Google Doc with HTML might overwrite some Google Docs specific advanced formatting (like page margins).
  // But given the "magical" requirement for a mixed-content document, this is the most robust approach.
  await drive.files.update({
    fileId: documentId,
    media: {
      mimeType: 'text/html',
      body: fixedHtml
    }
  });

  return {
    documentId,
    url: documentUrl,
  };
}

/**
 * Format Markdown in existing Google Doc Tool
 */
export const formatMarkdownInDocTool = (env: Env) =>
  tool({
    description: 'Format any raw Markdown syntax found inside an existing Google Doc into proper Google Doc formatting.',
    parameters: formatMarkdownInDocSchema,
    execute: async ({ documentUrl }) => {
      try {
        const result = await formatMarkdownInDoc(env, documentUrl);
        return {
          success: true,
          message: `Successfully formatted markdown inside the Google Doc.`,
          data: result
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  });
