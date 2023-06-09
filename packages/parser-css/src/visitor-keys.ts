export const visitorKeys: Record<string, string[]> = {
  Program: [],
  AtRule: ["name", "params"],
  Rule: ["selector"],
  Declaration: ["prop", "value"],
  DeclarationProp: ["value"],
  DeclarationValue: ["value"],
  Comment: ["text"],
};
