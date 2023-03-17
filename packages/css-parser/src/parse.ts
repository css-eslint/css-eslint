import postcss from "postcss";

import { normalizeNode } from "./utils";
import type { ParserOptions, RootNode } from "./types";
import { visitorKeys } from "./visitor-keys";
import { tokenize } from "./tokenize";

export const parse = async (code: string, _options?: ParserOptions) => {
  const { root } = await postcss().process(code, { from: undefined });

  const ast = normalizeNode(root) as RootNode;

  return ast;
};

export const parseForEslint = async (code: string, _options?: ParserOptions) => {
  const ast = await parse(code, _options);
  const tokens = await tokenize(code);

  return {
    ast,
    comments: [],
    visitorKeys,
    tokens,
  };
};
