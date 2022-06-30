import { join } from "path";
import { readFileSync } from "fs";
import MarkdownIt from "markdown-it";
import markdownItConditionalRender from "../src/index";

function readText(path: string): string {
  return readFileSync(path, "ascii").toString();
}

const markdownIt = MarkdownIt();
markdownIt.use(markdownItConditionalRender, {});

describe("if-else", () => {
  const IF_ELSE_MD = readText(join(__dirname, "./if-else/index.md"));
  const IF_TRUE_HTML = readText(join(__dirname, "./if-else/if-true.html"));
  const ELSE_TRUE_HTML = readText(join(__dirname, "./if-else/else-true.html"));

  it("if-true", () => {
    expect(
      markdownIt.render(IF_ELSE_MD, {
        flag: {
          value: true,
        },
      })
    ).toEqual(IF_TRUE_HTML);
  });

  it("else-true", () => {
    expect(
      markdownIt.render(IF_ELSE_MD, {
        flag: {
          value: false,
        },
      })
    ).toEqual(ELSE_TRUE_HTML);
  });
});

describe("if-elseif-else", () => {
  const IF_ELSEIF_ELSE_MD = readText(join(__dirname, "./if-elseif-else/index.md"));
  const IF_TRUE_HTML = readText(join(__dirname, "./if-elseif-else/if-true.html"));
  const ELSEIF_TRUE_HTML = readText(join(__dirname, "./if-elseif-else/elseif-true.html"));
  const ELSE_TRUE_HTML = readText(join(__dirname, "./if-elseif-else/else-true.html"));

  it("if-true", () => {
    expect(
      markdownIt.render(IF_ELSEIF_ELSE_MD, {
        flag: {
          value_1: true,
          value_2: true,
        },
      })
    ).toEqual(IF_TRUE_HTML);
  });

  it("elseif-true", () => {
    expect(
      markdownIt.render(IF_ELSEIF_ELSE_MD, {
        flag: {
          value_1: false,
          value_2: true,
        },
      })
    ).toEqual(ELSEIF_TRUE_HTML);
  });

  it("else-true", () => {
    expect(
      markdownIt.render(IF_ELSEIF_ELSE_MD, {
        flag: {
          value_1: false,
          value_2: false,
        },
      })
    ).toEqual(ELSE_TRUE_HTML);
  });
});
