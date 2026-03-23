import sys

with open('src/pages/index.astro', 'r') as f:
    content = f.read()

import_stmt = 'import { MarkdownTools } from "@/components/MarkdownTools";\n'
content = content.replace('import { CompareDocs } from "@/components/CompareDocs";', 'import { CompareDocs } from "@/components/CompareDocs";\n' + import_stmt)

render_stmt = '  <MarkdownTools client:load />\n  <CompareDocs client:load />'
content = content.replace('  <CompareDocs client:load />', render_stmt)

with open('src/pages/index.astro', 'w') as f:
    f.write(content)
