const fs = require('fs');

const file = 'src/components/ChatSidebar.tsx';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(/  PanelLeftClose,\n/, '');
content = content.replace(/  PanelLeftOpen\n/, '');

fs.writeFileSync(file, content);
