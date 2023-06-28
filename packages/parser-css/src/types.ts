export interface Position {
  line: number;
  column: number;
}

export interface Location {
  start: Position;
  end: Position;
}

type WithLocAndRange<T> = T & {
  loc: Location;
  range: [number, number];
};

export type NodeType = AnyNodeWithLocAndRange["type"];

export type CommentNode = WithLocAndRange<{
  type: "Comment";
  text: string;
}>;

export type AtRule = WithLocAndRange<{
  type: "AtRule";
  name: string;
  params: string;
  body: AnyNodeWithLocAndRange[];
}>;

export type RuleNode = WithLocAndRange<{
  type: "Rule";
  selector: string;
  body: AnyNodeWithLocAndRange[];
}>;

export type DeclarationNode = WithLocAndRange<{
  type: "Declaration";
  prop: string;
  value: string;
}>;

export type ProgramNode = WithLocAndRange<{
  type: "Program";
  body: AnyNodeWithLocAndRange[];
  comments: [];
}>;

export type AnyNodeWithLocAndRange =
  | CommentNode
  | AtRule
  | RuleNode
  | DeclarationNode
  | ProgramNode;

export interface ParserOptions {}

export interface Token {
  type: string;
  loc: Location;
  range: [number, number];
  value: string;
}

export type Parse = (
  code: string,
  _options?: ParserOptions,
) => Promise<ProgramNode>;
