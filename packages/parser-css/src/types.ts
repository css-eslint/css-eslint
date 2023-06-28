export interface Position {
  line: number;
  column: number;
}

export interface Location {
  start: Position;
  end: Position;
}

type WithSharedData<T> = T & {
  loc: Location;
  range: [number, number];
};

export type NodeType = AnyNode["type"];

export type CommentNode = WithSharedData<{
  type: "Block";
  value: string;
}>;

export type AtRuleNode = WithSharedData<{
  type: "AtRule";
  name: string;
  params: string;
  body: AnyNode[];
}>;

export type RuleNode = WithSharedData<{
  type: "Rule";
  selector: string;
  body: AnyNode[];
}>;

export type DeclarationProp = WithSharedData<{
  type: "DeclarationProp";
  value: string;
}>;

export type DeclarationValue = WithSharedData<{
  type: "DeclarationValue";
  value: string;
}>;

export type DeclarationNode = WithSharedData<{
  type: "Declaration";
  prop: DeclarationProp;
  value: DeclarationValue;
}>;

export type ProgramNode = WithSharedData<{
  type: "Program";
  sourceType: "module";
  body: AnyNode[];
  comments: CommentNode[];
  tokens: Token[];
}>;

export type AnyNode =
  | CommentNode
  | AtRuleNode
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
