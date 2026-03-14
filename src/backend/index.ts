import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';

/**
 * Main Hono application with OpenAPI support
 * Serves REST API, WebSocket routes, and static assets
 */

const app = new OpenAPIHono<{ Bindings: Env }>();

// Enable CORS
app.use('/*', cors());

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

// OpenAPI documentation configuration
app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'Workspace Agent API',
    version: '1.0.0',
    description: 'REST API for Workspace Agent - Google Workspace orchestration platform',
  },
  servers: [
    {
      url: 'https://workspace-agent.hacolby.workers.dev',
      description: 'Production server',
    },
  ],
});

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
