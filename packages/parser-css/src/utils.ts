import type { AnyNode } from "postcss";
import { pascalCase } from "scule";

import type { AnyNodeWithLocAndRange, Token } from "./types";

const TYPE_MAP = {
  atrule: "AtRule",
  comment: "Comment",
  decl: "Declaration",
  rule: "Rule",
  root: "Program",
  document: "Document",
} as const;

type KeyTypes = keyof typeof TYPE_MAP;

const normalizeName = <T extends KeyTypes>(name: T) => TYPE_MAP[name];

const normalizeLocEnd = (node: AnyNode) =>
  node.type === "root"
    ? {
        line: node.source?.input?.css.split(/\r?\n/).length ?? 0,
        column: 0,
      }
    : {
        line: node.source?.end?.line ?? 0,
        column: node.source?.end?.column ?? 0,
      };

const normalizeRangeEnd = (node: AnyNode) =>
  node.type === "root"
    ? node.source?.input?.css.length ?? 0
    : node.source?.end?.offset ?? 0;

const DATA_KEYS = [
  "text",
  "name",
  "params",
  "selector",
  "prop",
  "value",
] as const;

export function normalizeNode(node: AnyNode) {
  const locEnd = normalizeLocEnd(node);
  const rangeEnd = normalizeRangeEnd(node);

  const normalizedNode: AnyNodeWithLocAndRange = {
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
      (normalizedNode as any)[key] = node[key as keyof AnyNode];
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

export const getComments = (tokens: Token[]) =>
  tokens.filter((t) => t.type === "Comment").map((t) => t.value.slice(2, -2));
