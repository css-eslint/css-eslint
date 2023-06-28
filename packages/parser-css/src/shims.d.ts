declare module "postcss/lib/tokenize" {
  import { Input } from "postcss";

  type Token = [string, string, number, number];
  interface Processor {
    endOfFile(): boolean;
    nextToken(): Token;
  }

  export default function tokenizer(input: Input): Processor;
}