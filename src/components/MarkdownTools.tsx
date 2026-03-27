import * as React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { FileTextIcon, FileCode2Icon, CheckCircle2Icon, Loader2Icon } from "lucide-react";

export function MarkdownTools() {
  const [activeTab, setActiveTab] = useState<'create' | 'format'>('create');

  // Create State
  const [createTitle, setCreateTitle] = useState("New Markdown Document");
  const [createMarkdown, setCreateMarkdown] = useState("# Hello World\n\nThis is a **markdown** string that will become a properly formatted Google Doc.");
  const [createLoading, setCreateLoading] = useState(false);
  const [createResult, setCreateResult] = useState<any>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  // Format State
  const [formatUrl, setFormatUrl] = useState("");
  const [formatLoading, setFormatLoading] = useState(false);
  const [formatResult, setFormatResult] = useState<any>(null);
  const [formatError, setFormatError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateResult(null);

    try {
      const response = await fetch('/api/tools/create-doc-from-markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: createTitle, markdownContent: createMarkdown }),
      });

      const data: any = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create document');
      }

      setCreateResult(data.data);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleFormat = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormatLoading(true);
    setFormatError(null);
    setFormatResult(null);

    try {
      const response = await fetch('/api/tools/format-markdown-in-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentUrl: formatUrl }),
      });

      const data: any = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to format document');
      }

      setFormatResult(data.data);
    } catch (err) {
      setFormatError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setFormatLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-8 border-dashed shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileCode2Icon className="w-5 h-5" />
            <CardTitle>Markdown Tools</CardTitle>
          </div>
          <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-md p-1">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1 text-sm rounded-sm transition-colors ${activeTab === 'create' ? 'bg-white dark:bg-zinc-800 shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Create from Markdown
            </button>
            <button
              onClick={() => setActiveTab('format')}
              className={`px-3 py-1 text-sm rounded-sm transition-colors ${activeTab === 'format' ? 'bg-white dark:bg-zinc-800 shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Format Existing Doc
            </button>
          </div>
        </div>
        <CardDescription>
          {activeTab === 'create'
            ? "Provide a markdown string to generate a properly formatted Google Doc natively."
            : "Magically parse and format markdown mixed inside an existing Google Doc via AI."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {activeTab === 'create' && (
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="createTitle">Document Title</Label>
              <Input
                id="createTitle"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                placeholder="My Generated Document"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="createMarkdown">Markdown Content</Label>
              <Textarea
                id="createMarkdown"
                value={createMarkdown}
                onChange={(e) => setCreateMarkdown(e.target.value)}
                placeholder="# Heading\n\nSome **bold** text..."
                className="min-h-[200px] font-mono text-sm"
                required
              />
            </div>

            <Button type="submit" disabled={createLoading} className="w-full">
              {createLoading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
              {createLoading ? 'Creating Document...' : 'Generate Google Doc'}
            </Button>

            {createError && (
              <div className="p-3 mt-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md dark:bg-red-950/20 dark:border-red-900/50">
                {createError}
              </div>
            )}

            {createResult && (
              <div className="p-4 mt-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-md">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-2">
                  <CheckCircle2Icon className="w-5 h-5" />
                  Document Created Successfully!
                </div>
                <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <p><strong>Title:</strong> {createResult.title}</p>
                  <p><strong>ID:</strong> {createResult.documentId}</p>
                  <a href={createResult.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mt-2 inline-block">
                    Open in Google Docs &rarr;
                  </a>
                </div>
              </div>
            )}
          </form>
        )}

        {activeTab === 'format' && (
          <form onSubmit={handleFormat} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="formatUrl">Google Doc URL</Label>
              <Input
                id="formatUrl"
                value={formatUrl}
                onChange={(e) => setFormatUrl(e.target.value)}
                placeholder="https://docs.google.com/document/d/..."
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                The AI agent will fetch the document, identify raw markdown syntax, and replace it with proper formatting while preserving existing styles.
              </p>
            </div>

            <Button type="submit" disabled={formatLoading || !formatUrl} className="w-full">
              {formatLoading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
              {formatLoading ? 'Formatting Document with AI...' : 'Format Markdown in Doc'}
            </Button>

            {formatError && (
              <div className="p-3 mt-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md dark:bg-red-950/20 dark:border-red-900/50">
                {formatError}
              </div>
            )}

            {formatResult && (
              <div className="p-4 mt-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-md">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-2">
                  <CheckCircle2Icon className="w-5 h-5" />
                  Document Formatted Successfully!
                </div>
                <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <a href={formatResult.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mt-2 inline-block">
                    Open in Google Docs &rarr;
                  </a>
                </div>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
