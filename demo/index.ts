import MarkdownIt from "markdown-it";
import markdownItConditionalRender from "../src/index";
import { version } from "../package.json";

const engine = MarkdownIt();
engine.use(markdownItConditionalRender);

const nodeOptions = document.getElementById("options") as HTMLTextAreaElement;
const nodeMarkdown = document.getElementById("md") as HTMLTextAreaElement;
const nodeHtml = document.getElementById("html")!;

nodeMarkdown.addEventListener("input", (event) => {
  const { value } = event.target as HTMLTextAreaElement;
  try {
    const options = window.eval(`res = ${nodeOptions.value}`);
    nodeHtml.innerHTML = engine.render(value, options);
  } catch (error) {}
});

nodeOptions.addEventListener("input", (event) => {
  const { value } = event.target as HTMLTextAreaElement;
  try {
    const options = window.eval(`res = ${value}`);
    nodeHtml.innerHTML = engine.render(nodeMarkdown.value, options);
  } catch (error) {}
});

window.addEventListener("DOMContentLoaded", () => {
  nodeMarkdown.innerHTML = `... normal

::if flag.value_1

if flag.value_1 === true

::elseif flag.value_2

elseif flag.value_2 === true

::else

else

::endif

normal ...`;
  nodeOptions.innerHTML = `{
  flag: {
    value_1: true,
    value_2: false,
  }
}`;
  nodeOptions.dispatchEvent(new Event("input"));

  document.getElementById("version")!.innerText = `v${version}`;
});
