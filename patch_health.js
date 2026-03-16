const fs = require('fs');

const file = 'src/components/HealthDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(/\{recentEvents\.map\(\(event, idx\) => \(\n\s*<TableRow key=\{idx\}>/, `{recentEvents.map((event) => (\n                <TableRow key={\`\${event.component}-\${event.time}\`}>`);

fs.writeFileSync(file, content);
