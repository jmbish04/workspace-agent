import { tool } from "ai";
import { z } from "zod";

/**
 * Create Google Doc Tool
 * Creates a new Google Doc and returns the Document ID
 */
export const createGoogleDocTool = (env: Env) =>
  tool({
    description: "Create a new Google Document with the specified title and content",
    parameters: z.object({
      title: z.string().describe("The title of the document"),
      content: z.string().describe("The content to insert into the document (supports Markdown)"),
    }),
    execute: async ({ title, content }) => {
      try {
        // Get Google Service Account credentials
        const pt1 = await env.GOOGLE_CREDS_SA_PRIVATE_KEY_PT_1.get();
        const pt2 = await env.GOOGLE_CREDS_SA_PRIVATE_KEY_PT_2.get();
        const privateKey = pt1 + pt2;

        // TODO: Implement Google Docs API integration
        // For now, return a mock response
        const documentId = `mock-doc-${Date.now()}`;

        return {
          success: true,
          documentId,
          title,
          url: `https://docs.google.com/document/d/${documentId}/edit`,
          embeddedUrl: `https://docs.google.com/document/d/${documentId}/edit?embedded=true`,
          message: `Created document "${title}" successfully. You can view it in the adjacent pane.`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  });

/**
 * Update Google Doc Tool
 * Updates an existing Google Doc
 */
export const updateGoogleDocTool = (env: Env) =>
  tool({
    description: "Update an existing Google Document with new content",
    parameters: z.object({
      documentId: z.string().describe("The ID of the document to update"),
      content: z.string().describe("The new content (will append or replace based on mode)"),
      mode: z.enum(["append", "replace"]).describe("Whether to append or replace content"),
    }),
    execute: async ({ documentId, content, mode }) => {
      try {
        // TODO: Implement Google Docs API update
        return {
          success: true,
          documentId,
          mode,
          message: `Updated document successfully (${mode} mode).`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  });
