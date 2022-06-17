
- [概述](#概述)
- [用法](#用法)

## 概述

Markdown It 条件渲染插件，灵感来自 [markdown-it-condition](https://www.npmjs.com/package/markdown-it-condition)，原仓库已被删除或转移，从 NPM 获取到代码，见 [markdown-it-condition.js](./src/markdown-it-condition.js)

## 用法

```js
const MarkdownIt = require("markdown-it")
const markdownItEngine = new MarkdownIt();
const markdownItConditionalRendering = require("markdown-it-conditional-rendering");

markdownItEngine.use(markdownItConditionalRendering);

const res = markdownItEngine.render(
  `
::if flag.value

*This text will be shown*

::else

*This text won't

::endif
`,
{
    flag: {
      value: true,
    },
});

console.log(res);
```
