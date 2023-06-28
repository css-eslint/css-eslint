import postcss from "postcss";
import { runAsWorker } from "synckit";

import type { Parse, RootNode } from "./types";
import { normalizeNode } from "./utils";

runAsWorker<RootNode, Parse>(async (code, _options) => {
  const { root } = await postcss().process(code, { from: undefined });
  const ast = normalizeNode(root) as RootNode;

  return ast;
});
