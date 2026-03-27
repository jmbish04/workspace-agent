import { DurableObject } from "cloudflare:workers";

export class WorkspaceAgent extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async fetch(request: Request): Promise<Response> {
    return new Response("Workspace Agent Online");
  }
}
