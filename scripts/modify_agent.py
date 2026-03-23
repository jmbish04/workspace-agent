import sys

with open('src/backend/ai/agents/WorkspaceAgent.ts', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import { compareGoogleDocsTool } from '../tools/compareGoogleDocs';\n"
content = content.replace("import { createAppsScriptTool } from '../tools/appsScript';", "import { createAppsScriptTool } from '../tools/appsScript';\n" + import_stmt)

# Register tool
registration = "      createAppsScriptTool(this.env),\n      compareGoogleDocsTool(this.env),"
content = content.replace("      createAppsScriptTool(this.env),", registration)

with open('src/backend/ai/agents/WorkspaceAgent.ts', 'w') as f:
    f.write(content)
