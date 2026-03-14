import { Hono } from 'hono';

const app = new Hono();

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

export default {
  fetch: app.fetch,
};

export class WorkspaceAgent {
  constructor() {}
  async fetch() {
    return new Response("WorkspaceAgent");
  }
}
