import sys

with open('src/backend/index.ts', 'r') as f:
    content = f.read()

import_stmt = "import { createDocFromMarkdownSchema, formatMarkdownInDocSchema, createDocFromMarkdown, formatMarkdownInDoc } from './ai/tools/markdownToDoc';\n"
content = content.replace("import { compareDocsSchema", import_stmt + "import { compareDocsSchema")

new_routes = """
// Create Google Doc from Markdown API endpoint
app.post('/api/tools/create-doc-from-markdown', async (c) => {
  try {
    const body = await c.req.json();
    const { title, markdownContent } = createDocFromMarkdownSchema.parse(body);

    const result = await createDocFromMarkdown(c.env, title, markdownContent);
    return c.json({
      success: true,
      message: `Successfully created formatted Google Doc "${title}".`,
      data: result
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 400);
  }
});

// Format Markdown inside existing Google Doc API endpoint
app.post('/api/tools/format-markdown-in-doc', async (c) => {
  try {
    const body = await c.req.json();
    const { documentUrl } = formatMarkdownInDocSchema.parse(body);

    const result = await formatMarkdownInDoc(c.env, documentUrl);
    return c.json({
      success: true,
      message: `Successfully formatted markdown inside the Google Doc.`,
      data: result
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 400);
  }
});
"""

# The file might have been formatted by Prettier, so let's match on a shorter string
content = content.replace('app.post("/api/tools/compare-docs"', new_routes + 'app.post("/api/tools/compare-docs"')
# If it didn't work because of double quotes, try single quotes
content = content.replace("app.post('/api/tools/compare-docs'", new_routes + "app.post('/api/tools/compare-docs'")

with open('src/backend/index.ts', 'w') as f:
    f.write(content)
