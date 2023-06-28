import type { AnyNode as PostcssAnyNode } from "postcss";
import { pascalCase } from "scule";

import type { AnyNode, DeclarationNode } from "./types";

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

  const code = node.source?.input?.css ?? "";
  const nodeText = code.slice(normalizedNode.range[0], normalizedNode.range[1]);

  for (const key of DATA_KEYS) {
    if (key in node) {
      (normalizedNode as any)[key] = node[key as keyof PostcssAnyNode];
    }
  }

  if ("nodes" in node) {
    (normalizedNode as any).body = node.nodes.map(normalizeNode);
  }

  if (node.type === "decl") {
    (normalizedNode as DeclarationNode).prop = {
      type: "DeclarationProp",
      loc: {
        start: normalizedNode.loc.start,
        end: {
          line: normalizedNode.loc.start.line,
          column: normalizedNode.loc.start.column + node.prop.length,
        },
      },
      range: [
        normalizedNode.range[0],
        normalizedNode.range[0] + node.prop.length,
      ],
      value: node.prop,
    };

    const valueRangeStart =
      normalizedNode.range[0] + nodeText.indexOf(node.value);
    const valueRangeEnd = valueRangeStart + node.value.length;

    // FIXME: Loc is wrong
    (normalizedNode as DeclarationNode).value = {
      type: "DeclarationValue",
      loc: {
        start: {
          line: normalizedNode.loc.start.line,
          column: normalizedNode.loc.start.column + node.prop.length + 1,
        },
        end: normalizedNode.loc.end,
      },
      range: [valueRangeStart, valueRangeEnd],
      value: node.value,
    };
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
