import sys

with open('src/pages/index.astro', 'r') as f:
    content = f.read()

import_stmt = 'import { CompareDocs } from "@/components/CompareDocs";\n'
content = content.replace('import { ComponentExample } from "@/components/ComponentExample";', 'import { ComponentExample } from "@/components/ComponentExample";\n' + import_stmt)

render_stmt = '  <CompareDocs client:load />\n  <ComponentExample client:load />'
content = content.replace('  <ComponentExample client:load />', render_stmt)

with open('src/pages/index.astro', 'w') as f:
    f.write(content)
