export interface Position {
  line: number
  column: number
}

export interface Location {
  start: Position
  end: Position
}

type WithLocAndRange<T> = T & {
  loc: Location
  range: [number, number]
};

export type NodeType = "Root" | "AtRule" | "Rule" | "Declaration" | "Comment" | "Document";

export type CommentNode = WithLocAndRange<{
  type: "Comment"
  text: string
}>;

export type AtRule = WithLocAndRange<{
  type: "AtRule"
  name: string
  params: string
  body: AnyNodeWithLocAndRange[]
}>;

export type RuleNode = WithLocAndRange<{
  type: "Rule"
  selector: string
  body: AnyNodeWithLocAndRange[]
}>;

export type DeclarationNode = WithLocAndRange<{
  type: "Declaration"
  prop: string
  value: string
}>;

export type RootNode = WithLocAndRange<{
  type: "Root"
  body: AnyNodeWithLocAndRange[]
  comments: []
}>;

export type AnyNodeWithLocAndRange = CommentNode | AtRule | RuleNode | DeclarationNode | RootNode;

export interface ParserOptions {}

export interface Token {
  type: string
  loc: Location
  range: [number, number]
  value: string
}
