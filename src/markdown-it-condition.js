module.exports = function condition_plugin(md, name, options) {
  function validateDefault() {
    return true;
  }

  options = options || {};

  var validate = options.validate || validateDefault;

  function beginsWith(text, marker) {
    return text.substring(0, marker.length) === marker;
  }

  function conditionRule(state, startLine, endLine, silent) {
    var currentLine,
      token,
      start = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine],
      ifConditionMarker = options.ifConditionMarker || "::if",
      elseConditionMarker = options.elseConditionMarker || "::else",
      elseifConditionMarker = options.elseifConditionMarker || "::elseif",
      endifConditionMarker = options.endifConditionMarker || "::endif",
      condition;

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
  }

  md.block.ruler.before("fence", "condition_" + name, conditionRule);

  function evaluateCondition(env, condition) {
    var fields = condition.split(".");
    var element = env;

    fields.forEach(function (field) {
      element = element[field];
    });
    if (element) {
      return true;
    }

    return false;
  }

  md.core.ruler.push("remove-condition-token", function (state) {
    // Decide wether tokens are valid or are to be removed
    var validToken = true;

    for (var tokenIndex = 0; tokenIndex < state.tokens.length; tokenIndex++) {
      var token = state.tokens[tokenIndex];

      switch (token.type) {
        case "condition_if":
        case "condition_elseif":
          validToken = evaluateCondition(state.env, token.info);
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
