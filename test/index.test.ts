import MarkdownIt from "markdown-it";
import markdownItIfElse from "../src/index";
import { raw_md } from "./example";

const engine = MarkdownIt();
engine.use(markdownItIfElse);

describe("raw markdown", () => {
  it("if", () => {
    expect(engine.render(raw_md)).toEqual(`

if

`);
  });
});
