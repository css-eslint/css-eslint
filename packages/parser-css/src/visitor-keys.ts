export const visitorKeys: Record<string, string[]> = {
  Root: [],
  AtRule: ["name", "params"],
  Rule: ["selector"],
  Declaration: ["prop", "value"],
  Comment: ["text"],
};
