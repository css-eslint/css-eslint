import postcss from "postcss";

import { tokenize } from "./tokenize";
import type { ParserOptions, RootNode } from "./types";
import { normalizeNode } from "./utils";
import { visitorKeys } from "./visitor-keys";

export async function parse(code: string, _options?: ParserOptions) {
  const { root } = await postcss().process(code, { from: undefined });
  const ast = normalizeNode(root) as RootNode;

  return ast;
}

export async function parseForEslint(code: string, _options?: ParserOptions) {
  const ast = await parse(code, _options);
  const tokens = tokenize(code, _options);

  return {
    ast,
    comments: [],
    visitorKeys,
    tokens,
  };
}
