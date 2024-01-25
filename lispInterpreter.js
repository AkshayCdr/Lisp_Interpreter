let globalEnv = {
  "+": (args) => args.reduce((acc, curr) => acc + curr, 0),
  "-": (args) => {
    if (args.length === 1) return -args[0];
    if (args.length === 0) return 0;
    return args.reduce((acc, curr) => acc - curr);
  },
  "*": (args) => args.reduce((acc, curr) => acc * curr, 1),
  "/": (args) => (args.length === 2 ? args[0] / args[1] : null),
  ">": (args) => (args.length === 2 ? args[0] > args[1] : null),
  ">=": (args) => (args.length === 2 ? args[0] >= args[1] : null),
  "<": (args) => (args.length === 2 ? args[0] < args[1] : null),
  "<=": (args) => (args.length === 2 ? args[0] <= args[1] : null),
  "equal?": (args) => (args.length === 2 ? args[0] === args[1] : null),
  pi: Math.PI,
  pow: (args) => (args.length === 2 ? Math.pow(args[0], args[1]) : null),
  length: (args) => args.length,
  abs: (args) => (args.length === 1 ? Math.abs(args[0]) : null),
  sqrt: (args) => (args.length === 1 ? Math.sqrt(args[0]) : null),
  max: (args) => Math.max(...args),
  min: (args) => Math.min(...args),
  list: (...args) => args,
  car: (args) => args[0],
  // cdr: (args) => args.join("").slice(1).split(""),
  cdr: (args) => args.slice(1),
  cons: (args) => {
    if (args.length !== 2) return null;
    const [a, ...b] = args;
    return [a, ...b];
  },
  // map: (args) => {},
};

function specialParser(input, env) {
  input = input.trim();
  const [value, remainingInput] = tokenParser(input);
  if (
    value === null ||
    !["define", "begin", "if", "lambda", "quote", "set!"].includes(value)
  )
    return null;

  const specialParsers = {
    define: defineParser,
    begin: beginParser,
    if: ifParser,
    lambda: lambdaParser,
    quote: quoteParser,
    "set!": setParser,
  };
  const output = specialParsers[value](remainingInput, env);
  return output !== null ? [output[0], output[1]] : null;
}

function expressionParser(input, env) {
  input = input.trim();
  if (!input.startsWith("(")) return null;

  input = input.slice(1).trim();

  if (input.startsWith(")")) {
    input = input.slice(1);
    return ["()", input];
  }

  const output = specialParser(input, env);
  if (output !== null) return [output[0], output[1]];

  //get function
  let result = parser(input, env);
  if (result === null) return null;

  const functn = result[0];
  input = result[1];

  if (typeof functn === "function") {
    const params = [];
    while (!input.trim().startsWith(")")) {
      input = input.trim();
      const result = parser(input, env);
      if (result) {
        params.push(result[0]);
        input = result[1];
      }
      input = input.trim();
    }
    if (input.startsWith(")")) input = input.slice(1).trim();

    const output = functn(params);
    if (output || output === false || output === 0) {
      if (output[0]) {
        return [output[0], input];
      }
      return [output, input];
    } else {
      return null;
    }
  }
  return null;
}

function defineParser(input, env) {
  input = input.trim();

  //variable
  const [variable, remainingInput1] = tokenParser(input, env);
  input = remainingInput1.trim();

  //value
  const [value, remainingInput2] = parser(input, env);
  input = remainingInput2.trim();

  if (input.startsWith(")")) input = input.slice(1).trim();

  env[variable] = value;
  return [value, input];
}

function beginParser(input, env) {
  input = input.trim();
  let result;
  while (input.trim().startsWith("(")) {
    input = input.trim();
    const temp = parser(input, env);
    if (temp === null) return null;
    result = temp[0];
    input = temp[1];
    if (input.startsWith(")")) input = input.slice(1).trim();
  }
  return [result, input];
}

function bracketParser(input) {
  let i = 0;
  const stack = [];
  while (i < input.length) {
    if (input[i] === "(") stack.push(input[i]);
    if (input[i] === ")") {
      const temp = stack.pop();
      if (temp !== "(") break;
    }
    i++;
  }
  return [input.substring(0, i), input.slice(i + 1)];
}

function lambdaParser(input, env) {
  input = input.trim();

  if (input.startsWith("(")) input = input.slice(1).trim();
  const args = [];
  //arguments
  while (!input.startsWith(")")) {
    const [result, remainingInput] = tokenParser(input, env) || [];
    if (result) args.push(result);
    input = remainingInput;
  }
  //remove ')' (args ')'
  if (input.startsWith(")")) input = input.slice(1).trim();
  //body
  const [body, remainingInput] = bracketParser(input, env) || [];

  const innerFunction = (param) => {
    const lambdaEnv = { ...env };
    args.forEach((args, index) => (lambdaEnv[args] = param[index]));
    const [result, remainingInput] = parser(body, lambdaEnv) || [];
    return [result, remainingInput];
  };

  env[innerFunction] = body;
  return [innerFunction, remainingInput];
}

function ifStringParserBracketParser(input) {
  let i = 0;
  while (input[i] !== ")") i++;
  return input.slice(i + 1);
}

function ifParser(input, env) {
  input = input.trim();
  const [condition, remainingInput] = parser(input, env) || [];

  if (condition) {
    //arg1
    const [result, remainingInput2] = parser(remainingInput.trim(), env) || [];
    //arg2 - string
    if (remainingInput2.trim().startsWith("(")) {
      input = ifStringParserBracketParser(remainingInput2.trim());
    } else {
      input = tokenParser(remainingInput2.trim())[1];
    }
    if (input.startsWith(")")) input = input.slice(1).trim();
    return [result, input.trim()];
  } else {
    if (remainingInput.trim().startsWith("(")) {
      input = ifStringParserBracketParser(remainingInput.trim());
    } else {
      input = tokenParser(remainingInput.trim())[1];
    }
    input = input.trim();
    //arg2
    let [result, remainingInput2] = parser(input, env) || [];

    if (remainingInput2.trim().startsWith(")")) {
      input = remainingInput2.trim().slice(1);
    }

    return [result, input.trim()];
  }
}

function quoteParser(input, env) {
  input = input.trim();
  const result = bracketParser(input);
  return [result[0], result[1]];
}

function setParser(input, env) {
  input = input.trim();
  //variable
  const [variable, remainingInput1] = tokenParser(input);
  if (!env.hasOwnProperty(variable)) return null;
  //value
  const [value, remainingInput2] = parser(remainingInput1.trim(), env);
  //assignment
  env[variable] = value;
  input = remainingInput2.trim();
  if (input.startsWith(")")) input = input.slice(1);
  return [value, input];
}

function tokenParser(input) {
  let i = 0;
  while (
    input[i] !== " " &&
    i < input.length &&
    input[i] !== ")" &&
    input[i] !== "("
  ) {
    i++;
  }
  if (input[i] === ")" || input[i] === "(")
    return [input.substring(0, i), input.slice(i)];

  return [input.substring(0, i), input.slice(i + 1)];
}

function numberParser(input) {
  const regex = /^([1-9]\d*|0)(\.\d*)?([Ee][+-]?\d+)?/;
  const result = input.match(regex);
  if (result) return [parseFloat(result[0]), input.slice(result[0].length)];
  return null;
}

function valueParser(input, env) {
  const result = tokenParser(input);
  const value = result[0];
  input = result[1];
  if (Object.prototype.hasOwnProperty.call(env, value))
    return [env[value], input];
  return null;
}

function booleanParser(input) {
  if (input.startsWith("#t")) return [true, input.slice(2)];
  if (input.startsWith("#f")) return [false, input.slice(2)];
  return null;
}
function stringParser(input) {
  if (!input.startsWith('"')) return null;
  let i = 1;
  while (input[i] !== '"') {
    if (input[i] === "\\") {
      if (
        !["b", "f", "n", "r", "t", "\\", "/", '"', "u"].includes(input[i + 1])
      ) {
        return null;
      }
      if (input[i + 1] === "u") {
        if (!input.slice(i + 2).match(/^[0-9a-fA-F]{4}/)) return null;
        i += 5;
      } else {
        i += 2;
      }
    } else {
      i++;
    }
  }
  return [input.substring(1, i), input.slice(i + 1)];
}
//function calling all parsers recurseively
function parser(input, env) {
  const result =
    expressionParser(input, env) ||
    numberParser(input, env) ||
    booleanParser(input, env) ||
    valueParser(input, env) ||
    stringParser(input);
  if (result !== null) return result;
  return null;
}

function main(input, env) {
  const output = [];
  //   const env = new Env();
  while (input !== null && input !== ")" && input !== "") {
    const result = parser(input, env);
    if (result === null || result === undefined) break;
    const value = result[0];
    input = result[1];
    if (input === ")") {
      output.push([value, { error: "syntax error extra ')'" }]);
      break;
    }
    output.push(value);
  }
  if (output.length < 1) return null;
  return output;
}

module.exports = {
  parser,
  globalEnv,
  main,
};
