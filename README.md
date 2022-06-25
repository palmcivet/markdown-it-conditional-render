
- [markdown-it-conditional-render](#markdown-it-conditional-render)
	- [概述](#概述)
	- [示例](#示例)
	- [TODO](#todo)

# markdown-it-conditional-render
## 概述

Markdown It 条件渲染插件，灵感来自 [markdown-it-condition](https://www.npmjs.com/package/markdown-it-condition)，原仓库已被删除或转移，从 NPM 获取到代码，见 [lib/markdown-it-condition.js](./lib/markdown-it-condition.js)

## 示例

```js
const MarkdownIt = require("markdown-it")
const markdownItEngine = new MarkdownIt();
const markdownItConditionalRender = require("markdown-it-conditional-render");

markdownItEngine.use(markdownItConditionalRender);

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

## TODO

- [x] 完善 API
- [x] 完善项目命名
- [ ] 添加单元测试
- [ ] 完善文档
- [ ] 添加 GitHub Actions
- [ ] 添加 Playground
- [ ] 支持嵌套条件判断
