import MarkdownIt from "markdown-it";
import markdownItIfElse from "../src/index";
import { raw_md } from "./example";

const engine = MarkdownIt();

engine.use(markdownItIfElse, {
  ifConditionMarker: "::if",
  elseifConditionMarker: "::elseif",
  elseConditionMarker: "::else",
  endifConditionMarker: "::endif",
});

document.getElementById("raw")!.innerText = raw_md;
document.getElementById("md")!.innerHTML = engine.render(raw_md, {
  flag: {
    value_1: true,
    value_2: false,
  },
});
