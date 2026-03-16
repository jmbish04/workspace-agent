const fs = require('fs');

const file = 'backend/src/routes/access-manager.ts';
let content = fs.readFileSync(file, 'utf-8');

// Replace hardcoded values with constants at top of file
const newConstants = `
const ALLOWED_EMAIL_DOMAIN = '126colby.com';
const ALLOWED_GITHUB_USER = 'jmbish04';
`;

content = content.replace(/const CLOUDFLARE_API_BASE = 'https:\/\/api.cloudflare.com\/client\/v4';/, `const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';\n${newConstants}`);

// Update policy payload
const oldPolicy = `    const policyPayload = {
      name: "Strict Identity Policy",
      decision: "allow",
      include: [
        { email_domain: { domain: "126colby.com" } },
        { github: { name: "jmbish04" } }
      ]
    };`;

const newPolicy = `    const policyPayload = {
      name: "Strict Identity Policy",
      decision: "allow",
      include: [
        { email_domain: { domain: ALLOWED_EMAIL_DOMAIN } },
        { github: { name: ALLOWED_GITHUB_USER } }
      ]
    };`;
content = content.replace(oldPolicy, newPolicy);

// Update catch block
const oldCatch = `  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }`;

const newCatch = `  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return c.json({ error: message }, 500);
  }`;
content = content.replace(oldCatch, newCatch);

fs.writeFileSync(file, content);
