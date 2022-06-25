import { PluginWithOptions } from "markdown-it";

interface IMarkdownItOptions {
  ruleName: string;
  ifMarker: string;
  elseMarker: string;
  elseIfMarker: string;
  endIfMarker: string;
  validate(condition: string): boolean;
  evaluate(condition: string, value: any): boolean;
}

function beginsWith(text: string, marker: string): boolean {
  return text.substring(0, marker.length) === marker;
}

export const plugin: PluginWithOptions<IMarkdownItOptions> = (md, options): void => {
  const {
    ruleName = "condition",
    ifMarker = "::if",
    elseMarker = "::else",
    elseIfMarker = "::elseif",
    endIfMarker = "::endif",
    validate = (condition: string) => true,
    evaluate = (condition: string, value: any) => {
      let element = value;

      condition.split(".").forEach((field) => {
        element = element[field];
      });

      if (!!element) {
        return true;
      }

      return false;
    },
  } = options || {};

  md.block.ruler.before("fence", `${ruleName}_block`, (state, startLine, endLine, silent) => {
    let currentLine,
      token,
      start = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

    let condition: string;

    let text = state.src.substring(start, max);

    if (beginsWith(text, ifMarker)) {
      condition = text.substring(ifMarker.length + 1);
    } else {
      return false;
    }

    if (!validate(condition)) {
      return false;
    }

    // Since start is found, we can report success here in validation mode
    //
    if (silent) {
      return true;
    }

    // Search for the end of the block
    //
    currentLine = startLine;

    token = state.push(`${ruleName}_if`, "", 1);
    token.info = condition;
    token.map = [startLine, currentLine];
    token.hidden = true;

    let lastLine = currentLine;

    let oldLineMax = state.lineMax;

    for (;;) {
      currentLine++;
      if (currentLine >= endLine) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
        break;
      }

      start = state.bMarks[currentLine] + state.tShift[currentLine];
      max = state.eMarks[currentLine];
      text = state.src.substring(start, max);

      if (beginsWith(text, elseIfMarker)) {
        // Tokenize everything before
        state.lineMax = currentLine;
        state.md.block.tokenize(state, lastLine + 1, currentLine);

        condition = text.substring(elseIfMarker.length + 1);
        token = state.push(`${ruleName}_elseif`, "", 1);
        token.block = true;
        token.info = condition;
        token.map = [currentLine, currentLine];
        token.hidden = true;

        lastLine = currentLine;
        state.lineMax = oldLineMax;
      } else if (beginsWith(text, elseMarker)) {
        // Tokenize everything before
        state.lineMax = currentLine;
        state.md.block.tokenize(state, lastLine + 1, currentLine);

        token = state.push(`${ruleName}_else`, "", 1);
        token.block = true;
        token.map = [currentLine, currentLine];
        token.hidden = true;

        lastLine = currentLine;
        state.lineMax = oldLineMax;
      } else if (beginsWith(text, endIfMarker)) {
        // Tokenize everything before
        state.lineMax = currentLine;
        state.md.block.tokenize(state, lastLine + 1, currentLine);

        token = state.push(`${ruleName}_endif`, "", 1);
        token.block = true;
        token.map = [currentLine, currentLine];
        token.hidden = true;

        lastLine = currentLine;
        state.lineMax = oldLineMax;

        break;
      }
    }

    state.line = currentLine + 1;
    state.lineMax = oldLineMax + 1;

    return true;
  });

  md.core.ruler.push(`${ruleName}_evaluate`, ({ tokens, env }) => {
    let shouldRemove = false;
    let isValid = false;

    for (let index = 0; index < tokens.length; index++) {
      const currentToken = tokens[index];

      switch (currentToken.type) {
        case `${ruleName}_if`:
          isValid = evaluate(currentToken.info, env);
          shouldRemove = !isValid;
          break;
        case `${ruleName}_elseif`:
          if (!isValid) {
            isValid = evaluate(currentToken.info, env);
            shouldRemove = !isValid;
          } else {
            shouldRemove = true;
          }
          break;
        case `${ruleName}_else`:
          shouldRemove = isValid;
          break;
        case `${ruleName}_endif`:
          shouldRemove = false;
          break;
        default:
          if (shouldRemove) {
            tokens.splice(index, 1);
            index--;
          }
          break;
      }
    }

    return false;
  });
};
