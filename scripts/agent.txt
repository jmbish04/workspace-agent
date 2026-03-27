import { AIChatAgent } from '@cloudflare/ai-chat';
import { drizzle } from 'drizzle-orm/d1';
import { createGoogleDocTool } from '../tools/googleDocs';
import { createGoogleSheetTool, readGoogleSheetTool } from '../tools/googleSheets';
import { draftGmailTool } from '../tools/gmail';
import { createAppsScriptTool } from '../tools/appsScript';
import { transcripts, messages } from '../../db/schemas';

/**
 * WorkspaceAgent - AI Agent for Google Workspace orchestration
 *
 * Extends AIChatAgent to provide:
 * - Real-time chat with streaming responses
 * - Google Workspace tool integration (Docs, Sheets, Gmail, Apps Script)
 * - Persistent state via DO SQLite
 * - Transcript syncing to D1 for global queries
 */
export class WorkspaceAgent extends AIChatAgent<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  /**
   * Configure the AI model and tools
   */
  protected async onStart() {
    // Get AI Gateway Universal endpoint URL for OpenAI compatibility
    const gatewayBaseUrl = this.env.AI.gateway('workspace-agent').url('universal');

    // Configure the AI client with AI Gateway
    // The gateway allows us to use OpenAI SDK format while routing to any provider
    this.setAIOptions({
      model: 'openai/gpt-4o', // Can be changed to: anthropic/claude-3-5-sonnet, workers-ai/@cf/meta/llama-3.3-70b-instruct-fp8-fast
      apiKey: await this.env.OPENAI_API_KEY.get(),
      baseURL: gatewayBaseUrl,
      temperature: 0.7,
      maxTokens: 4096,
    });

    // Set the system prompt
    this.setSystemPrompt(`You are the Workspace Agent, an expert Cloudflare and Google Workspace orchestration AI.
You have direct integration with Google Docs, Sheets, Gmail, and Apps Script.
When the user asks to create or modify a document, use the appropriate tool.
When writing Apps Script, ensure it utilizes modern V8 runtime features and ES6+ syntax.
Always inform the user when a document has been updated so they can review it in the adjacent viewer pane.
Think step-by-step before executing destructive actions.`);

    // Register Google Workspace tools
    this.registerTools([
      createGoogleDocTool(this.env),
      createGoogleSheetTool(this.env),
      readGoogleSheetTool(this.env),
      draftGmailTool(this.env),
      createAppsScriptTool(this.env),
    ]);
  }

  /**
   * Sync transcripts to D1 for global querying
   * Called after each message exchange
   */
  protected async afterChatMessage(message: { role: string; content: string; tool_calls?: any }) {
    try {
      // Initialize Drizzle client
      const db = drizzle(this.env.DB);

      // Get the current transcript ID from state
      let transcriptId = await this.getState('transcriptId');

      if (!transcriptId) {
        // Create a new transcript if it doesn't exist
        const newTranscriptId = crypto.randomUUID();
        await this.setState('transcriptId', newTranscriptId);
        transcriptId = newTranscriptId;

        // Insert transcript into D1 using Drizzle ORM
        const now = new Date();
        await db.insert(transcripts).values({
          id: newTranscriptId,
          title: 'New Conversation',
          createdAt: now,
          updatedAt: now,
        });
      }

      // Insert message into D1 using Drizzle ORM
      await db.insert(messages).values({
        id: crypto.randomUUID(),
        transcriptId: transcriptId,
        role: message.role as 'user' | 'assistant' | 'system',
        content: message.content,
        toolCalls: message.tool_calls ? JSON.stringify(message.tool_calls) : null,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Failed to sync transcript to D1:', error);
      // Don't throw - we don't want to break the chat flow
    }
  }
}
