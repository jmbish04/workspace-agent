import { Trash2Icon, PlusIcon, FileTextIcon } from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";

export function CompareDocs() {
  const [documentTitle, setDocumentTitle] = useState("COMPLAINT ATTACHED ADDENDUM");
  const [targetDocs, setTargetDocs] = useState([
    {
      url: "https://docs.google.com/document/d/1hTpPg8TbF2wPZS1y9XzkbT6_DCEiRnvpCgfkO8VOlvo/edit?tab=t.0",
      version: 1,
      date: "2026-02-28",
    },
    {
      url: "https://docs.google.com/document/d/1ghGFhjRXBAi3QUvLFg6H7ZX4asWa06AffemQoCTHh-o/edit?tab=t.0",
      version: 2,
      date: "2026-03-20",
    },
  ]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddDoc = () => {
    setTargetDocs([
      ...targetDocs,
      { url: "", version: targetDocs.length + 1, date: new Date().toISOString().split("T")[0] },
    ]);
  };

  const handleRemoveDoc = (index: number) => {
    const newDocs = [...targetDocs];
    newDocs.splice(index, 1);
    setTargetDocs(newDocs);
  };

  const handleDocChange = (index: number, field: string, value: string | number) => {
    const newDocs = [...targetDocs];
    newDocs[index] = { ...newDocs[index], [field]: value };
    setTargetDocs(newDocs);
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/tools/compare-docs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentTitle,
          targetDocs,
        }),
      });

      const data: { success: boolean; data?: string; error?: string; message?: string } = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to compare documents");
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto my-8 w-full max-w-4xl border-dashed shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5" />
          <CardTitle>Compare Google Docs</CardTitle>
        </div>
        <CardDescription>
          Run a diff against a series of Google Docs to generate an AI-friendly JSON payload.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCompare} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="documentTitle">Universal Document Title</Label>
            <Input
              id="documentTitle"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="e.g. COMPLAINT ATTACHED ADDENDUM"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Target Documents</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddDoc}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Document
              </Button>
            </div>

            {targetDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-zinc-200 bg-zinc-50 py-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                <FileTextIcon className="mb-2 h-8 w-8 text-zinc-400" />
                <p className="text-sm text-zinc-500">No documents added yet.</p>
                <p className="text-xs text-zinc-400">Add documents to compare their contents.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {targetDocs.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-md border bg-zinc-50/50 p-3 dark:bg-zinc-900/20"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-[1fr_80px_120px] gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Document URL</Label>
                          <Input
                            value={doc.url}
                            onChange={(e) => handleDocChange(index, "url", e.target.value)}
                            placeholder="https://docs.google.com/document/d/..."
                            required
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Version</Label>
                          <Input
                            type="number"
                            value={doc.version}
                            onChange={(e) =>
                              handleDocChange(index, "version", parseInt(e.target.value) || 0)
                            }
                            required
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Date</Label>
                          <Input
                            type="date"
                            value={doc.date}
                            onChange={(e) => handleDocChange(index, "date", e.target.value)}
                            required
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50"
                      onClick={() => handleRemoveDoc(index)}
                      disabled={targetDocs.length <= 1}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading || targetDocs.length === 0} className="w-full">
            {loading ? "Comparing..." : "Run Comparison"}
          </Button>
        </form>

        {error && (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-500 dark:border-red-900/50 dark:bg-red-950/20">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-2">
            <Label>Comparison Result</Label>
            <ScrollArea className="h-[400px] w-full rounded-md border bg-zinc-950 p-4">
              <pre className="font-mono text-xs leading-relaxed text-zinc-50">{result}</pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
