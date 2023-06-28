import type { ProgramNode, RuleNode } from "@css-eslint/parser-css";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce function style.",
    },
    fixable: "code",
    schema: [],
    messages: {
      arrow: "Expected an arrow function shorthand.",
      declaration: "Expected a function declaration.",
    },
  },
  create: () => ({
    Program(node: ProgramNode) {
      // eslint-disable-next-line no-console
      console.log(node);
    },
    Rule(node: RuleNode) {
      // eslint-disable-next-line no-console
      console.log(node);
    },
  }),
};
