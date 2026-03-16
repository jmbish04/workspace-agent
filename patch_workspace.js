const fs = require('fs');

const file = 'src/components/WorkspaceLayout.tsx';
let content = fs.readFileSync(file, 'utf-8');

const target = `  React.useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  }, [matches, query])`;

const replacement = `  React.useEffect(() => {
    const media = window.matchMedia(query)
    const listener = () => setMatches(media.matches)
    listener() // Check on mount
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])`;

content = content.replace(target, replacement);

// Also remove unused imports
content = content.replace(/  Menu,\n/, '');
content = content.replace(/  PanelLeftClose,\n/, '');
content = content.replace(/  PanelLeftOpen\n/, '');

fs.writeFileSync(file, content);
