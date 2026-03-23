import sys

with open('src/backend/ai/agents/WorkspaceAgent.ts', 'r') as f:
    content = f.read()

import_stmt = "import { createDocFromMarkdownTool, formatMarkdownInDocTool } from '../tools/markdownToDoc';\n"
content = content.replace("import { compareGoogleDocsTool } from '../tools/compareGoogleDocs';", import_stmt + "import { compareGoogleDocsTool } from '../tools/compareGoogleDocs';")

registration = "      createDocFromMarkdownTool(this.env),\n      formatMarkdownInDocTool(this.env),\n      compareGoogleDocsTool(this.env),"
content = content.replace("      compareGoogleDocsTool(this.env),", registration)

with open('src/backend/ai/agents/WorkspaceAgent.ts', 'w') as f:
    f.write(content)
