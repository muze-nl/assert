(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/assert-core.mjs
  var assert_core_exports = {};
  __export(assert_core_exports, {
    Optional: () => Optional,
    Recommended: () => Recommended,
    Required: () => Required,
    allOf: () => allOf,
    anyOf: () => anyOf,
    assert: () => assert,
    disable: () => disable,
    enable: () => enable,
    error: () => error,
    fails: () => fails,
    formatIssue: () => formatIssue,
    formatIssues: () => formatIssues,
    instanceOf: () => instanceOf,
    issues: () => issues,
    not: () => not,
    oneOf: () => oneOf,
    validEmail: () => validEmail,
    validURL: () => validURL,
    warn: () => warn
  });
  var assertEnabled = false;
  function enable() {
    assertEnabled = true;
  }
  function disable() {
    assertEnabled = false;
  }
  function appendPath(path = "", key) {
    if (typeof path == "undefined" || path == null) {
      path = "";
    }
    if (typeof key == "number") {
      return `${path}[${key}]`;
    }
    return `${path}.${key}`;
  }
  function pathToArray(path = "") {
    if (Array.isArray(path)) {
      return path;
    }
    if (!path) {
      return [];
    }
    let result = [];
    let matcher = /(?:^|\.)([^.\[\]]+)|\[(\d+)\]/g;
    let match;
    while (match = matcher.exec(path)) {
      if (typeof match[1] != "undefined") {
        result.push(match[1]);
      } else if (typeof match[2] != "undefined") {
        result.push(Number(match[2]));
      }
    }
    return result;
  }
  function pathToString(path = []) {
    if (typeof path == "string") {
      return path.startsWith(".") ? path.slice(1) : path;
    }
    return path.map((part, index) => {
      if (typeof part == "number") {
        return `[${part}]`;
      }
      return `${index ? "." : ""}${part}`;
    }).join("");
  }
  function describeFunction(value) {
    if (value === String) {
      return "string";
    }
    if (value === Number) {
      return "number";
    }
    if (value === Boolean) {
      return "boolean";
    }
    return value.name || "function";
  }
  function clip(text, maxLength = 60) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength - 1) + "\u2026";
  }
  function quoteString(value) {
    return `'${clip(String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n"))}'`;
  }
  function jsonSummary(value) {
    try {
      let json = JSON.stringify(value);
      if (typeof json == "string") {
        return clip(json);
      }
    } catch (e) {
    }
    let name = value?.constructor?.name;
    if (name && name != "Object") {
      return name;
    }
    return Object.prototype.toString.call(value);
  }
  function formatValue(value) {
    if (typeof value == "string") {
      return quoteString(value);
    }
    if (typeof value == "undefined") {
      return "undefined";
    }
    if (value === null) {
      return "null";
    }
    if (typeof value == "function") {
      return describeFunction(value);
    }
    if (value instanceof RegExp) {
      return value.toString();
    }
    if (typeof value == "number" || typeof value == "boolean" || typeof value == "bigint") {
      return String(value);
    }
    if (typeof value == "symbol") {
      return value.toString();
    }
    return jsonSummary(value);
  }
  function describeExpected(value) {
    if (value === String || value === Number || value === Boolean) {
      return describeFunction(value);
    }
    if (typeof value == "function") {
      return describeFunction(value);
    }
    if (value instanceof RegExp) {
      return value.toString();
    }
    if (Array.isArray(value)) {
      return "[" + value.map(describeExpected).join(", ") + "]";
    }
    return formatValue(value);
  }
  function describeOneOf(patterns) {
    return patterns.map(describeExpected).join(", ");
  }
  function conciseMessage(message, actual, expected) {
    if (message == "data and pattern are not equal") {
      return `expected ${formatValue(expected)}, found ${formatValue(actual)}`;
    }
    if (message == "data does not match pattern" || /^data\[\d+\] does not match pattern$/.test(message)) {
      return `expected ${describeExpected(expected)}, found ${formatValue(actual)}`;
    }
    if (message == "data is undefined, should match pattern") {
      return `missing; expected ${describeExpected(expected)}`;
    }
    if (message == "data is required") {
      return "required";
    }
    if (message == "data is an empty string, which is not allowed") {
      return "empty string is not allowed";
    }
    if (message == "data is not an object, pattern is") {
      return "data is not an object";
    }
    if (message == "data is not an instanceof pattern") {
      return `expected instance of ${describeExpected(expected)}, found ${formatValue(actual)}`;
    }
    if (message == "data does not match oneOf patterns" || message == "data does not match anyOf patterns") {
      return `expected one of ${describeOneOf(expected)}, found ${formatValue(actual)}`;
    }
    if (message == "data matches pattern, when required not to") {
      return `must not match ${describeExpected(expected)}`;
    }
    return message;
  }
  function formatIssue(issue, options = {}) {
    if (!issue || typeof issue != "object") {
      return String(issue);
    }
    let path = issue.pathString || pathToString(issue.path || []) || "value";
    let indent = options.indent ?? "";
    return `${indent}${path}: ${issue.message}`;
  }
  function formatIssues(issues2, options = {}) {
    if (!issues2) {
      return false;
    }
    let indent = options.indent ?? "  - ";
    return (Array.isArray(issues2) ? issues2 : [issues2]).map((issue) => formatIssue(issue, { ...options, indent }));
  }
  function issueFromProblem(problem) {
    if (!problem || typeof problem != "object") {
      return {
        path: [],
        pathString: "",
        message: String(problem),
        expected: void 0,
        actual: void 0
      };
    }
    let path = pathToArray(problem.path);
    let pathString = pathToString(path);
    let actual = problem.actual ?? problem.found;
    let expected = describeExpected(problem.expected);
    let message = conciseMessage(problem.message, actual, problem.expected);
    return {
      path,
      pathString,
      message,
      expected,
      actual
    };
  }
  function problemsToIssues(problems) {
    if (!problems) {
      return [];
    }
    let result = [];
    for (let problem of Array.isArray(problems) ? problems : [problems]) {
      if (!problem) {
        continue;
      }
      if (problem && typeof problem == "object" && problem.problems) {
        let nested = problemsToIssues(problem.problems);
        if (nested.length) {
          result = result.concat(nested);
          continue;
        }
      }
      result.push(issueFromProblem(problem));
    }
    return result;
  }
  function assert(source, test) {
    if (assertEnabled) {
      let problems = fails(source, test);
      if (problems) {
        let assertionIssues = problemsToIssues(problems);
        let formattedIssues = formatIssues(assertionIssues);
        let message = "Assertions failed:\n" + formattedIssues.join("\n");
        console.error("\u{1F170}\uFE0F  " + message);
        throw new Error(message, {
          cause: { problems, issues: assertionIssues, source }
        });
      }
    }
  }
  function Optional(pattern) {
    return function _Optional(data, root, path) {
      if (typeof data != "undefined" && data != null && typeof pattern != "undefined") {
        return fails(data, pattern, root, path);
      }
    };
  }
  function Required(pattern) {
    return function _Required(data, root, path) {
      if (data == null || typeof data == "undefined") {
        return error("data is required", data, pattern || "any value", path);
      } else if (typeof pattern != "undefined") {
        return fails(data, pattern, root, path);
      } else {
        return false;
      }
    };
  }
  function Recommended(pattern) {
    return function _Recommended(data, root, path) {
      if (data == null || typeof data == "undefined") {
        warn("data does not contain recommended value", data, pattern, path);
        return false;
      } else {
        return fails(data, pattern, root, path);
      }
    };
  }
  function oneOf(...patterns) {
    return function _oneOf(data, root, path) {
      for (let pattern of patterns) {
        if (!fails(data, pattern, root, path)) {
          return false;
        }
      }
      return error("data does not match oneOf patterns", data, patterns, path);
    };
  }
  function anyOf(...patterns) {
    return function _anyOf(data, root, path) {
      if (!Array.isArray(data)) {
        return error("data is not an array", data, "anyOf", path);
      }
      for (let [index, value] of data.entries()) {
        let itemPath = appendPath(path, index);
        if (oneOf(...patterns)(value, root, itemPath)) {
          return error("data does not match anyOf patterns", value, patterns, itemPath);
        }
      }
      return false;
    };
  }
  function allOf(...patterns) {
    return function _allOf(data, root, path) {
      let problems = [];
      for (let pattern of patterns) {
        problems = problems.concat(fails(data, pattern, root, path));
      }
      problems = problems.filter(Boolean);
      if (problems.length) {
        return error("data does not match all given patterns", data, patterns, path, problems);
      }
    };
  }
  function validURL(data, root, path) {
    try {
      if (data instanceof URL) {
        data = data.href;
      }
      let url = new URL(data);
      if (url.href != data) {
        if (!(url.href + "/" == data || url.href == data + "/")) {
          return error("data is not a valid url", data, "validURL", path);
        }
      }
    } catch (e) {
      return error("data is not a valid url", data, "validURL", path);
    }
  }
  function validEmail(data, root, path) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
      return error("data is not a valid email", data, "validEmail", path);
    }
  }
  function instanceOf(constructor) {
    return function _instanceOf(data, root, path) {
      if (!(data instanceof constructor)) {
        return error("data is not an instanceof pattern", data, constructor, path);
      }
    };
  }
  function not(pattern) {
    return function _not(data, root, path) {
      if (!fails(data, pattern, root, path)) {
        return error("data matches pattern, when required not to", data, pattern, path);
      }
    };
  }
  function issues(data, pattern, root) {
    let problems = fails(data, pattern, root);
    if (!problems) {
      return false;
    }
    return problemsToIssues(problems);
  }
  function fails(data, pattern, root, path = "") {
    if (typeof root == "undefined") {
      root = data;
    }
    let problems = [];
    if (pattern === Boolean) {
      if (typeof data != "boolean" && !(data instanceof Boolean)) {
        problems.push(error("data is not a boolean", data, pattern, path));
      }
    } else if (pattern === Number) {
      if (typeof data != "number" && !(data instanceof Number)) {
        problems.push(error("data is not a number", data, pattern, path));
      }
    } else if (pattern === String) {
      if (typeof data != "string" && !(data instanceof String)) {
        problems.push(error("data is not a string", data, pattern, path));
      }
      if (data == "") {
        problems.push(error("data is an empty string, which is not allowed", data, pattern, path));
      }
    } else if (pattern instanceof RegExp) {
      if (Array.isArray(data)) {
        let index = data.findIndex((element, index2) => fails(element, pattern, root, appendPath(path, index2)));
        if (index > -1) {
          problems.push(error("data[" + index + "] does not match pattern", data[index], pattern, appendPath(path, index)));
        }
      } else if (typeof data == "undefined") {
        problems.push(error("data is undefined, should match pattern", data, pattern, path));
      } else if (!pattern.test(data)) {
        problems.push(error("data does not match pattern", data, pattern, path));
      }
    } else if (pattern instanceof Function) {
      let problem = pattern(data, root, path);
      if (problem) {
        if (Array.isArray(problem)) {
          problems = problems.concat(problem);
        } else {
          problems.push(problem);
        }
      }
    } else if (Array.isArray(pattern)) {
      if (!Array.isArray(data)) {
        problems.push(error("data is not an array", data, [], path));
      } else {
        for (let p of pattern) {
          for (let index of data.keys()) {
            let problem = fails(data[index], p, root, appendPath(path, index));
            if (Array.isArray(problem)) {
              problems = problems.concat(problem);
            } else if (problem) {
              problems.push(problem);
            }
          }
        }
      }
    } else if (pattern && typeof pattern == "object") {
      if (Array.isArray(data)) {
        let index = data.findIndex((element, index2) => fails(element, pattern, root, appendPath(path, index2)));
        if (index > -1) {
          problems.push(error("data[" + index + "] does not match pattern", data[index], pattern, appendPath(path, index)));
        }
      } else if (!data || typeof data != "object") {
        problems.push(error("data is not an object, pattern is", data, pattern, path));
      } else {
        if (data instanceof URLSearchParams) {
          data = Object.fromEntries(data);
        }
        if (pattern instanceof Function) {
          let result = fails(data, pattern, root, path);
          if (result) {
            problems = problems.concat(result);
          }
        } else {
          for (const [patternKey, subpattern] of Object.entries(pattern)) {
            let result = fails(data[patternKey], subpattern, root, appendPath(path, patternKey));
            if (result) {
              problems = problems.concat(result);
            }
          }
        }
      }
    } else {
      if (pattern != data) {
        problems.push(error("data and pattern are not equal", data, pattern, path));
      }
    }
    if (problems.length) {
      return problems;
    }
    return false;
  }
  function error(message, found, expected, path = "", problems) {
    let pathParts = pathToArray(path);
    let result = {
      path,
      pathString: pathToString(pathParts),
      pathParts,
      message,
      found,
      expected
    };
    if (problems) {
      result.problems = problems;
    }
    return result;
  }
  function warn(message, data, pattern, path) {
    console.warn("\u{1F170}\uFE0F  Assert: " + path, message, pattern, data);
  }

  // src/assert.mjs
  globalThis.assert = { ...assert_core_exports };
})();
