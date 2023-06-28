import { createSyncFn } from "synckit";

import { tokenize } from "./tokenize";
import type { Parse, ParserOptions } from "./types";
import { getComments } from "./utils";
import { visitorKeys } from "./visitor-keys";

export const parse = createSyncFn<Parse>(require.resolve("./parse-worker.cjs"));

export function parseForEslint(code: string, _options?: ParserOptions) {
  const ast = parse(code, _options);
  const tokens = tokenize(code, _options);
  const comments = getComments(tokens);

  return {
    ast,
    comments,
    visitorKeys,
    tokens,
  };
}
