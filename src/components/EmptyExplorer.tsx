"use client";

import type { BundledLanguage } from "@/components/kibo-ui/code-block";
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
  type CodeBlockProps,
} from "@/components/kibo-ui/code-block";
import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
  TreeView,
} from "@/components/kibo-ui/tree";
import { Folder, Inbox, FileCode2 } from "lucide-react";
import { useState } from "react";

type FileContent = {
  name: string;
  language: string;
  code: string;
};


const fileContents: Record<string, FileContent> = {};

export default function EmptyExplorer() {
  const [selectedFile, setSelectedFile] = useState<string>("");

  const codeData: CodeBlockProps["data"] = Object.entries(fileContents).map(
    ([id, content]) => ({
      ...content,
      id,
      filename: content.name,
    })
  );

  const handleFileSelect = (fileId: string) => {
    if (fileContents[fileId]) {
      setSelectedFile(fileId);
    }
  };

  const isWorkspaceEmpty = Object.keys(fileContents).length === 0;

  return (
    <div className="grid h-screen w-full grid-cols-[300px_1fr] divide-x divide-zinc-800 overflow-hidden bg-zinc-950 text-zinc-50 dark">
      {/* Left Pane: File Explorer */}
      <div className="flex h-full w-full flex-col overflow-hidden bg-zinc-950/50">
        <div className="border-b border-zinc-800 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Explorer
        </div>
        <div className="flex-1 overflow-y-auto">
          {isWorkspaceEmpty ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <Inbox className="mb-4 h-12 w-12 text-zinc-800" />
              <p className="text-sm font-medium text-zinc-300">Empty Workspace</p>
              <p className="mt-2 text-xs text-zinc-500 max-w-[200px]">
                Initialize a project or create a new file to get started.
              </p>
            </div>
          ) : (
            <TreeProvider
              defaultExpandedIds={["workspace-root"]}
              onSelectionChange={(ids: string[]) => {
                if (ids.length > 0) {
                  handleFileSelect(ids[0]);
                }
              }}
              selectedIds={[selectedFile]}
            >
              <TreeView>
                <TreeNode nodeId="workspace-root">
                  <TreeNodeTrigger>
                    <TreeExpander hasChildren={false} />
                    <TreeIcon icon={<Folder className="h-4 w-4" />} />
                    <TreeLabel>workspace</TreeLabel>
                  </TreeNodeTrigger>
                  <TreeNodeContent>
                    {/* Dynamic injection payload target */}
                  </TreeNodeContent>
                </TreeNode>
              </TreeView>
            </TreeProvider>
          )}
        </div>
      </div>

      {/* Right Pane: Code Viewer */}
      <div className="flex h-full w-full items-center justify-center bg-zinc-950">
        {!selectedFile || codeData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <FileCode2 className="mb-4 h-16 w-16 text-zinc-800/50" />
            <p className="text-sm font-medium text-zinc-400">No file opened</p>
            <p className="mt-1 text-xs text-zinc-600">
              Select a file from the explorer to view its contents.
            </p>
          </div>
        ) : (
          <CodeBlock
            className="size-full overflow-y-auto rounded-none border-none bg-transparent"
            data={codeData}
            onValueChange={setSelectedFile}
            value={selectedFile}
          >
            <CodeBlockHeader className="border-b border-zinc-800 bg-zinc-900/50">
              <CodeBlockFiles>
                {(item) => (
                  <CodeBlockFilename key={item.filename} value={item.filename}>
                    {item.filename}
                  </CodeBlockFilename>
                )}
              </CodeBlockFiles>
              <CodeBlockCopyButton />
            </CodeBlockHeader>
            <CodeBlockBody className="h-[calc(100%-3rem)] bg-zinc-950">
              {(item) => (
                <CodeBlockItem key={item.filename} value={item.filename}>
                  <CodeBlockContent language={item.language as BundledLanguage}>
                    {item.code}
                  </CodeBlockContent>
                </CodeBlockItem>
              )}
            </CodeBlockBody>
          </CodeBlock>
        )}
      </div>
    </div>
  );
}
