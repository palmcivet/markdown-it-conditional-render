# markdown-it-conditional-render

[![build](https://github.com/palmcivet/markdown-it-conditional-render/actions/workflows/build.yml/badge.svg)](https://github.com/palmcivet/markdown-it-conditional-render/actions/workflows/build.yml)

English | [中文](./README.zh-CN.md)

Markdown It conditional rendering plugin, inspired by [markdown-it-condition](https://www.npmjs.com/package/markdown-it-condition), the original repository has been removed or moved, but the compiled and compressed code is still available in NPM and has been extracted from [lib/markdown-it-condition.js](./lib/markdown-it-condition.js).

## ⚙️ Options

- `ruleName`：*string*
  - Default: `condition`
  - Custom rule name
- `ifMarker`：*string*
  - Default: `::if`
  - Judging from here, *if* branching condition
- `elseIfMarker`：*string*
  - Default: `::elseif`
  - *else if* branching condition
- `elseMarker`：*string*
  - Default: `::else`
  - *else* branching condition
- `endIfMarker`：*string*
  - Default: `::endif`
  - End of judgment
- `validate(condition: string): boolean`
  - Preprocess the original text and verify the branching conditions in the text
  - Default returns `true`
- `evaluate(condition: string, value: any): boolean`
  - Parse the actual parameters and remove the text that does not meet the conditions
  - The default processing is as follows：

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

> The full usage of each parameter by default is shown in the [example](#-example)

## 📚 Example

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

## 🔧 Develop

```bash
$ git clone https://github.com/palmcivet/markdown-it-conditional-render.git
$ cd ./markdown-it-conditional-render
$ pnpm add
$ pnpm run build
```

## ⚖️ License

MIT
