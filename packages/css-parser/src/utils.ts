import type { AnyNode } from "postcss";

import type { AnyNodeWithLocAndRange } from "./types";

const TYPE_MAP = {
  atrule: "AtRule",
  comment: "Comment",
  decl: "Declaration",
  rule: "Rule",
  root: "Root",
  document: "Document",
};

const normalizeName = (name: keyof typeof TYPE_MAP) => TYPE_MAP[name];

const normalizeLocEnd = (node: AnyNode) => node.type === "root"
  ? {
      line: node.source?.input?.css.split(/\r?\n/).length ?? 0,
      column: 0,
    }
  : {
      line: node.source?.end?.line ?? 0,
      column: node.source?.end?.column ?? 0,
    };

const normalizeRangeEnd = (node: AnyNode) => node.type === "root"
  ? node.source?.input?.css.length ?? 0
  : node.source?.end?.offset ?? 0;

const DATA_KEYS = [
  "text",
  "name",
  "params",
  "selector",
  "prop",
  "value",
];

export const normalizeNode = (node: AnyNode) => {
  const locEnd = normalizeLocEnd(node);
  const rangeEnd = normalizeRangeEnd(node);

  const normalizedNode: AnyNodeWithLocAndRange = {
    type: normalizeName(node.type) as any,
    loc: {
      start: {
        line: node.source?.start?.line ?? 0,
        column: node.source?.start?.column ?? 0,
      },
      end: locEnd,
    },
    range: [
      node.source?.start?.offset ?? 0,
      rangeEnd,
    ],
  } as any;

  for (const key of DATA_KEYS) {
    if (key in node) {
      (normalizedNode as any)[key] = node[key as keyof AnyNode];
    }
  }

  if ("nodes" in node) {
    (normalizedNode as any).body = node.nodes.map(normalizeNode);
  }

  return normalizedNode;
};

const TOKEN_TYPE_MAP = {
  "comment": "Comment",
  "word": "Word",
  "space": "Space",
  "at-word": "AtWord",
  "brackets": "Brackets",
};

export const normalizeTokenType = (type: string) => {
  if (type in TOKEN_TYPE_MAP) {
    return TOKEN_TYPE_MAP[type as keyof typeof TOKEN_TYPE_MAP];
  }
  return "Punctuator";
};
