import { tool } from 'ai';
import { z } from 'zod';
import { google } from 'googleapis';

export const compareDocsSchema = z.object({
  documentTitle: z.string().describe('The universal title for this set of documents'),
  targetDocs: z.array(
    z.object({
      url: z.string().describe('The URL of the Google Doc'),
      version: z.number().describe('The version number of the document'),
      date: z.string().describe('The date of the document (YYYY-MM-DD)'),
    })
  ).describe('Array of document objects to compare'),
});

export async function generateDocComparison(env: Env, documentTitle: string, targetDocs: any[]) {
  const pt1 = await env.GOOGLE_CREDS_SA_PRIVATE_KEY_PT_1.get();
  const pt2 = await env.GOOGLE_CREDS_SA_PRIVATE_KEY_PT_2.get();
  const rawKey = pt1 + pt2;

  // Try to parse as JSON first in case the env var contains the full JSON credentials object.
  // Otherwise, use it as a raw private key string (would require a client_email to work).
  let auth;
  try {
    const parsed = JSON.parse(rawKey);
    auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: parsed.client_email,
        private_key: parsed.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/documents.readonly'],
    });
  } catch (e) {
    // If it's not JSON, assume it's just the private key.
    // However, without a client_email, google.auth.JWT won't work correctly.
    // We will attempt with a placeholder or fallback.
    auth = new google.auth.JWT({
      email: 'service-account@example.com', // Placeholder
      key: rawKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/documents.readonly'],
    });
  }

  const docs = google.docs({ version: 'v1', auth });

  const payload = {
    metadata: {} as Record<string, any>,
    document_content: {} as Record<string, string[]>,
    paragraphs: {} as Record<string, Record<string, string>>
  };

  const docsData: any[] = [];
  let maxSegments = 0;

  for (let index = 0; index < targetDocs.length; index++) {
    const docItem = targetDocs[index];
    const idMatch = docItem.url.match(/[-\w]{25,}/);
    if (!idMatch) {
      throw new Error(`Invalid Google Doc URL provided: ${docItem.url}`);
    }
    const docId = idMatch[0];

    try {
      const response = await docs.documents.get({ documentId: docId });
      const document = response.data;

      payload.metadata[docId] = {
        title: documentTitle,
        document_name: document.title || `Document ${docItem.version}`,
        version: docItem.version,
        document_date: docItem.date,
        version_order: index + 1
      };

      const cleanBlocks: string[] = [];

      if (document.body && document.body.content) {
        for (const element of document.body.content) {
          if (element.paragraph && element.paragraph.elements) {
            let paragraphText = "";
            for (const textElement of element.paragraph.elements) {
              if (textElement.textRun && textElement.textRun.content) {
                paragraphText += textElement.textRun.content;
              }
            }
            const trimmedText = paragraphText.trim();
            if (trimmedText.length > 0) {
              cleanBlocks.push(trimmedText);
            }
          }
        }
      }

      payload.document_content[docId] = cleanBlocks;

      docsData.push({
        id: docId,
        blocks: cleanBlocks
      });

      if (cleanBlocks.length > maxSegments) {
        maxSegments = cleanBlocks.length;
      }
    } catch (error) {
      console.error(`Error processing doc ${docItem.url}:`, error);
      throw new Error(`Failed to process document ${docItem.url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  for (let i = 0; i < maxSegments; i++) {
    const paragraphKey = (i + 1).toString();
    payload.paragraphs[paragraphKey] = {};

    docsData.forEach(data => {
      payload.paragraphs[paragraphKey][data.id] = data.blocks[i] || "NOT FOUND";
    });
  }

  return JSON.stringify(payload, null, 2);
}

/**
 * Compare Google Docs Tool
 * Extracts and compares native paragraphs from multiple Google Docs
 */
export const compareGoogleDocsTool = (env: Env) =>
  tool({
    description: 'Compare multiple Google Docs and generate a JSON payload with differences on a paragraph level.',
    parameters: compareDocsSchema,
    execute: async ({ documentTitle, targetDocs }) => {
      try {
        const jsonOutput = await generateDocComparison(env, documentTitle, targetDocs);

        return {
          success: true,
          message: `Successfully compared ${targetDocs.length} documents for "${documentTitle}".`,
          data: jsonOutput
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  });
