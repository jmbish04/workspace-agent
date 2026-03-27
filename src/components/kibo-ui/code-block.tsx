import * as React from "react";

export type BundledLanguage = string;

export interface CodeBlockProps {
  data: any[];
  onValueChange: (value: string) => void;
  value: string;
  className?: string;
  children?: React.ReactNode;
}

export function CodeBlock({ data, onValueChange, value, className, children }: CodeBlockProps) {
  return <div className={className}>{children}</div>;
}

export function CodeBlockHeader({ className, children }: { className?: string, children?: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}

export function CodeBlockFiles({ children }: { children: (item: any) => React.ReactNode }) {
  return <>{children({ filename: "stub" })}</>;
}

export function CodeBlockFilename({ value, children }: { value: string, children: React.ReactNode }) {
  return <span>{children}</span>;
}

export function CodeBlockCopyButton() {
  return <button>Copy</button>;
}

export function CodeBlockBody({ className, children }: { className?: string, children: (item: any) => React.ReactNode }) {
  return <div className={className}>{children({ filename: "stub", language: "tsx", code: "stub" })}</div>;
}

export function CodeBlockItem({ value, children }: { value: string, children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function CodeBlockContent({ language, children }: { language: string, children: React.ReactNode }) {
  return <div>{children}</div>;
}
