import { Input } from "postcss";
// @ts-expect-error No type
import tokenizer from "postcss/lib/tokenize";

import type { ParserOptions, Token } from "./types";
import { normalizeTokenType } from "./utils";

const NEWLINE_RE = /\r?\n/g;

export const tokenize = (code: string, _options?: ParserOptions) => {
  const processor = tokenizer(new Input(code));
  const tokens: Token[] = [];
  let line = 1;
  let column = 0;
  let prevLine = 1;
  let prevColumn = 1;
  while (!processor.endOfFile()) {
    const token: [string, string, number, number] = processor.nextToken();
    const [type, value] = token;
    let [,, start, end] = token;
    if (start === undefined) {
      start = tokens[tokens.length - 1]?.range[1];
    }
    if (end === undefined) {
      end = start + 1;
    }

    const splited = value.split(NEWLINE_RE);

    if (splited.length > 1) {
      line += splited.length - 1;
      column = 0;
    }
    column += splited[splited.length - 1].length;

    tokens.push({
      type: normalizeTokenType(type),
      range: [start, end],
      loc: {
        start: {
          line: prevLine,
          column: prevColumn,
        },
        end: {
          line,
          column,
        },
      },
      value,
    });

    prevLine = line;
    prevColumn = column;
  }

  return tokens;
};
