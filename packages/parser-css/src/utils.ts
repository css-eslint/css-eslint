import type { AnyNode as PostcssAnyNode } from "postcss";
import { pascalCase } from "scule";

import type { AnyNode } from "./types";

export const NEWLINE_RE = /\r?\n/;

const TYPE_MAP = {
  atrule: "AtRule",
  comment: "Block",
  decl: "Declaration",
  rule: "Rule",
  root: "Program",
  document: "Document",
} as const;

type KeyTypes = keyof typeof TYPE_MAP;

const normalizeName = <T extends KeyTypes>(name: T) => TYPE_MAP[name];

const normalizeLocEnd = (node: PostcssAnyNode) =>
  node.type === "root"
    ? {
        line: node.source?.input?.css.split(/\r?\n/).length ?? 1,
        column: 1,
      }
    : {
        line: node.source?.end?.line ?? 1,
        column: node.source?.end?.column ?? 1,
      };

const normalizeRangeEnd = (node: PostcssAnyNode) =>
  (node.type === "root"
    ? node.source?.input?.css.length ?? 0
    : node.source?.end?.offset ?? 0) + 1;

const DATA_KEYS = [
  "text",
  "name",
  "params",
  "selector",
  "prop",
  "value",
] as const;

export function normalizeNode(node: PostcssAnyNode) {
  const locEnd = normalizeLocEnd(node);
  const rangeEnd = normalizeRangeEnd(node);

  const normalizedNode: AnyNode = {
    type: normalizeName(node.type),
    loc: {
      start: {
        line: node.source?.start?.line ?? 0,
        column: node.source?.start?.column ?? 0,
      },
      end: locEnd,
    },
    range: [node.source?.start?.offset ?? 0, rangeEnd],
  } as any;

  for (const key of DATA_KEYS) {
    if (key in node) {
      (normalizedNode as any)[key] = node[key as keyof PostcssAnyNode];
    }
  }

  if ("nodes" in node) {
    (normalizedNode as any).body = node.nodes.map(normalizeNode);
  }

  return normalizedNode;
}

const TOKEN_TYPES = ["comment", "word", "space", "at-word", "brackets"];

export function normalizeTokenType(type: string) {
  if (TOKEN_TYPES.includes(type)) {
    return pascalCase(type);
  }

  return "Punctuator";
}
