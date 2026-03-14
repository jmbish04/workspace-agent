import { Hono } from 'hono';

interface Env {
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_ZONE_ID: string;
}

const app = new Hono<{ Bindings: Env }>();
const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

async function cloudflareApiRequest(env: Env, method: string, path: string, body?: any) {
  const response = await fetch(`${CLOUDFLARE_API_BASE}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`Cloudflare API error: ${response.status} - ${JSON.stringify(errorBody)}`);
  }
  return response.json();
}

app.post('/access/policies/strict-auth/:appId', async (c) => {
  try {
    const zoneId = c.env.CLOUDFLARE_ZONE_ID;
    const appId = c.req.param('appId');

    // Strict policy applying the `@126colby.com` and `jmbish04` constraints
    const policyPayload = {
      name: "Strict Identity Policy",
      decision: "allow",
      include: [
        { email_domain: { domain: "126colby.com" } },
        { github: { name: "jmbish04" } }
      ]
    };

    const data = await cloudflareApiRequest(
      c.env,
      'POST',
      `/zones/${zoneId}/access/apps/${appId}/policies`,
      policyPayload
    );

    return c.json({ success: true, data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
