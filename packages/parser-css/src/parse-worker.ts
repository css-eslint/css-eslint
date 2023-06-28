import postcss from "postcss";
import { runAsWorker } from "synckit";

import type { Parse, ProgramNode } from "./types";
import { normalizeNode } from "./utils";

runAsWorker<ProgramNode, Parse>(async (code, _options) => {
  const { root } = await postcss().process(code, { from: undefined });
  const ast = normalizeNode(root) as ProgramNode;

  return ast;
});
