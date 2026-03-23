import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { WorkspaceAgent } from './ai/agents';

/**
 * Main Hono application with OpenAPI support
 * Serves REST API, WebSocket routes, and static assets
 */

const app = new OpenAPIHono<{ Bindings: Env }>();

// Enable CORS
app.use('/api/*', cors({
  origin: (origin) => {
    // Allow localhost and the configured APP_URL
    return origin === 'http://localhost:4321' || origin?.includes('hacolby.workers.dev') || false;
  },
  credentials: true,
}));

// Root route
app.get('/', (c) => {
  return c.json({
    name: 'Workspace Agent',
    version: '1.0.0',
    description: 'Edge-native AI assistant for Google Workspace orchestration',
  });
});

// Health check route
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// WebSocket upgrade endpoint for WorkspaceAgent
app.get('/api/agents/workspace/:sessionId', async (c) => {
  const { sessionId } = c.req.param();

  // Check if this is a WebSocket upgrade request
  if (c.req.header('upgrade') !== 'websocket') {
    return c.json({ error: 'Expected WebSocket upgrade' }, 400);
  }

  // Get the Durable Object stub
  const id = c.env.WORKSPACE_AGENT.idFromName(sessionId);
  const stub = c.env.WORKSPACE_AGENT.get(id);

  // Forward the request to the Durable Object
  return stub.fetch(c.req.raw);
});

// OpenAPI documentation configuration
app.doc('/openapi.json', (c) => ({
  openapi: '3.1.0',
  info: {
    title: 'Workspace Agent API',
    version: '1.0.0',
    description: 'REST API for Workspace Agent - Google Workspace orchestration platform',
  },
  servers: [
    {
      url: c.env.APP_URL,
      description: 'Production server',
    },
  ],
}));

// Swagger UI
app.get('/swagger', swaggerUI({ url: '/openapi.json' }));

/**
 * Worker fetch handler
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;

// Export the WorkspaceAgent Durable Object
export { WorkspaceAgent };
