import * as React from "react";

export function TreeProvider({ defaultExpandedIds, onSelectionChange, selectedIds, children }: any) {
  return <div>{children}</div>;
}

export function TreeView({ children }: any) {
  return <div>{children}</div>;
}

export function TreeNode({ nodeId, level, isLast, children }: any) {
  return <div>{children}</div>;
}

export function TreeNodeTrigger({ children }: any) {
  return <div>{children}</div>;
}

export function TreeExpander({ hasChildren }: any) {
  return <span>{hasChildren ? '+' : '-'}</span>;
}

export function TreeIcon({ icon, hasChildren }: any) {
  return <span>{icon}</span>;
}

export function TreeLabel({ children }: any) {
  return <span>{children}</span>;
}

export function TreeNodeContent({ hasChildren, children }: any) {
  return <div>{children}</div>;
}
