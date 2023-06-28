import type { Linter } from "eslint";
import { createSyncFn } from "synckit";

import type { Parse, ParserOptions } from "./types";
import { visitorKeys } from "./visitor-keys";

export const parse = createSyncFn<Parse>(require.resolve("./parse-worker.cjs"));

export function parseForEslint(code: string, _options?: ParserOptions) {
  const ast = parse(code, _options);

  return {
    ast: ast as any,
    visitorKeys,
  } as Linter.ESLintParseResult;
}
