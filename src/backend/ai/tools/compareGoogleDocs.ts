import { tool } from "ai";
import { z } from "zod";

export const compareDocsSchema = z.object({
  documentTitle: z.string().describe("The universal title for this set of documents"),
  targetDocs: z
    .array(
      z.object({
        url: z.string().describe("The URL of the Google Doc"),
        version: z.number().describe("The version number of the document"),
        date: z.string().describe("The date of the document (YYYY-MM-DD)"),
      }),
    )
    .describe("Array of document objects to compare"),
});

export function generateDocComparisonMock(documentTitle: string, targetDocs: z.infer<typeof compareDocsSchema>["targetDocs"]) {
  const payload = {
    metadata: {} as Record<string, any>,
    document_content: {} as Record<string, string[]>,
    paragraphs: {} as Record<string, Record<string, string>>,
  };

  const docsData: any[] = [];
  let maxSegments = 0;

  targetDocs.forEach((docItem, index) => {
    // Extract ID
    const idMatch = docItem.url.match(/[-\w]{25,}/);
    const docId = idMatch ? idMatch[0] : `mock-id-${index}`;

    payload.metadata[docId] = {
      title: documentTitle,
      document_name: `Mock Document ${docItem.version}`,
      version: docItem.version,
      document_date: docItem.date,
      version_order: index + 1,
    };

    // Mock content blocks
    const cleanBlocks = [
      `This is paragraph 1 of version ${docItem.version}`,
      `This is paragraph 2 of version ${docItem.version}`,
      index % 2 === 0 ? `This is paragraph 3 of version ${docItem.version}` : "",
    ].filter((text) => text.length > 0);

    payload.document_content[docId] = cleanBlocks;

    docsData.push({
      id: docId,
      blocks: cleanBlocks,
    });

    if (cleanBlocks.length > maxSegments) {
      maxSegments = cleanBlocks.length;
    }
  });

  for (let i = 0; i < maxSegments; i++) {
    const paragraphKey = (i + 1).toString();
    payload.paragraphs[paragraphKey] = {};

    docsData.forEach((data) => {
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
    description:
      "Compare multiple Google Docs and generate a JSON payload with differences on a paragraph level.",
    parameters: compareDocsSchema,
    execute: async ({ documentTitle, targetDocs }) => {
      try {
        const jsonOutput = generateDocComparisonMock(documentTitle, targetDocs);

        return {
          success: true,
          message: `Successfully compared ${targetDocs.length} documents for "${documentTitle}".`,
          data: jsonOutput,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  });
