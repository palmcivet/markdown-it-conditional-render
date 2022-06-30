
- [markdown-it-conditional-render](#markdown-it-conditional-render)
  - [概述](#概述)
  - [配置](#配置)
  - [示例](#示例)
  - [TODO](#todo)

# markdown-it-conditional-render
## 概述

Markdown It 条件渲染插件，灵感来自 [markdown-it-condition](https://www.npmjs.com/package/markdown-it-condition)，原仓库已被删除或转移，但 NPM 仍可获取到代码，已摘录于 [lib/markdown-it-condition.js](./lib/markdown-it-condition.js)

## 配置

- `ruleName`
  - *string*。默认 `condition`
  - 自定义规则名
- `ifMarker`
  - *string*。默认 `::if`
  - 开始判断，if 分支条件
- `elseIfMarker`
  - *string*。默认 `::elseif`
  - else if 分支条件
- `elseMarker`
  - *string*。默认 `::else`
  - else 分支条件
- `endIfMarker`
  - *string*。默认 `::endif`
  - 结束判断
- `validate(condition: string): boolean`
  - 预处理原始文本，验证文本中的分支条件
  - 默认返回 `true`
- `evaluate(condition: string, value: any): boolean`
  - 解析实际参数，移除不满足条件的文本
  - 默认处理如下：

	```ts
	function evaluate(condition: string, value: any) {
		let element = value;
		condition.split(".").forEach((field) => {
			element = element[field];
		});

		if (!!element) {
			return true;
		}

		return false;
	}
	```

> 各参数缺省时的完整使用方式见 [示例](#示例)

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
- [x] 完善文档
- [x] 添加单元测试
- [ ] 添加 GitHub Actions
- [ ] 添加 Playground
- [ ] 支持嵌套条件判断
