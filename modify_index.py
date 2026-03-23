import sys

with open('src/backend/index.ts', 'r') as f:
    content = f.read()

import_stmt = "import { compareDocsSchema, generateDocComparisonMock } from './ai/tools/compareGoogleDocs';\n"
content = content.replace("import { WorkspaceAgent } from './ai/agents';", "import { WorkspaceAgent } from './ai/agents';\n" + import_stmt)

new_route = """

// Compare Google Docs API endpoint
app.post('/api/tools/compare-docs', async (c) => {
  try {
    const body = await c.req.json();
    const { documentTitle, targetDocs } = compareDocsSchema.parse(body);

    const jsonOutput = generateDocComparisonMock(documentTitle, targetDocs);
    return c.json({
      success: true,
      message: `Successfully compared ${targetDocs.length} documents for "${documentTitle}".`,
      data: jsonOutput
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 400);
  }
});

"""

content = content.replace("app.get('/health', (c) => {\n  return c.json({\n    status: 'healthy',\n    timestamp: new Date().toISOString(),\n  });\n});", "app.get('/health', (c) => {\n  return c.json({\n    status: 'healthy',\n    timestamp: new Date().toISOString(),\n  });\n});" + new_route)

with open('src/backend/index.ts', 'w') as f:
    f.write(content)
