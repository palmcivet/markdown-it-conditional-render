import { PluginWithOptions } from "markdown-it";

interface IMarkdownItIfElseOptions {
  ifConditionMarker: string;
  elseConditionMarker: string;
  elseifConditionMarker: string;
  endifConditionMarker: string;
  validate(raw: string): boolean;
  evaluateCondition(condition: string, env: any): boolean;
}

function beginsWith(text: string, marker: string): boolean {
  return text.substring(0, marker.length) === marker;
}

export const ifElsePlugin: PluginWithOptions<IMarkdownItIfElseOptions> = (md, options): void => {
  const {
    ifConditionMarker = "::if",
    elseConditionMarker = "::else",
    elseifConditionMarker = "::elseif",
    endifConditionMarker = "::endif",
    validate = () => true,
    evaluateCondition = (condition: string, env: any) => {
      const fields = condition.split(".");
      let element = env;

      fields.forEach(function (field) {
        element = element[field];
      });

      if (element) {
        return true;
      }

      return false;
    },
  } = options ?? {};

  md.block.ruler.before("fence", "condition_block", (state, startLine, endLine, silent) => {
    var currentLine,
      token,
      start = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

    let condition: string;

    var text = state.src.substring(start, max);

    if (beginsWith(text, ifConditionMarker)) {
      condition = text.substring(ifConditionMarker.length + 1);
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

    token = state.push("condition_if", "", 1);
    token.info = condition;
    token.map = [startLine, currentLine];
    token.hidden = true;

    var lastLine = currentLine;

    var oldLineMax = state.lineMax;

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

      if (beginsWith(text, elseifConditionMarker)) {
        // Tokenize everything before
        state.lineMax = currentLine;
        state.md.block.tokenize(state, lastLine + 1, currentLine);

        condition = text.substring(elseifConditionMarker.length + 1);
        token = state.push("condition_elseif", "", 1);
        token.block = true;
        token.info = condition;
        token.map = [currentLine, currentLine];
        token.hidden = true;

        lastLine = currentLine;
        state.lineMax = oldLineMax;
      } else if (beginsWith(text, elseConditionMarker)) {
        // Tokenize everything before
        state.lineMax = currentLine;
        state.md.block.tokenize(state, lastLine + 1, currentLine);

        token = state.push("condition_else", "", 1);
        token.block = true;
        token.map = [currentLine, currentLine];
        token.hidden = true;

        lastLine = currentLine;
        state.lineMax = oldLineMax;
      } else if (beginsWith(text, endifConditionMarker)) {
        // Tokenize everything before
        state.lineMax = currentLine;
        state.md.block.tokenize(state, lastLine + 1, currentLine);

        token = state.push("condition_endif", "", 1);
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

  md.core.ruler.push("evaluate_condition", (state) => {
    console.log(state);

    let validToken = true;

    for (var tokenIndex = 0; tokenIndex < state.tokens.length; tokenIndex++) {
      const token = state.tokens[tokenIndex];

      console.log({ token });

      switch (token.type) {
        case "condition_if":
        case "condition_elseif":
          validToken = evaluateCondition(token.info, state.env);
          break;
        case "condition_else":
          validToken = !validToken;
          break;
        case "condition_endif":
          validToken = true;
          break;
        default:
          if (!validToken) {
            state.tokens.splice(tokenIndex, 1);
            tokenIndex--;
          }
      }
    }

    return false;
  });
};
