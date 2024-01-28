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
  cdr: (args) => args.slice(1),
  // map: (args) => {},
};

function specialParser(input, env) {
  input = input.trim();
  const [value, remainingInput] = operandParser(input);
  if (value === null || !["define", "begin", "if", "lambda", "quote", "set!"].includes(value))
    return null;

  const specialParsers = {define: defineParser,begin: beginParser,if: ifParser,lambda: lambdaParser,quote: quoteParser, "set!": setParser };
  const output = specialParsers[value](remainingInput, env);
  return output !== null ? output : null;
}

function expressionParser(input, env) {
  if (!input.trim().startsWith("(")) return null;

  input = input.trim().slice(1).trim();

  if (input.startsWith(")")) return ["()", input.slice(1)];

  const output = specialParser(input, env);
  if (output !== null) return output;

  const [functn, remainingInput] = parser(input, env) || [];
  if (functn === null || functn === undefined) return null;
  input = remainingInput.trim();

  if (typeof functn === "function") {
    const params = [];
    while (!input.trim().startsWith(")")) {
      const result = parser(input.trim(), env);
      if (result) {
        params.push(result[0]);
        input = result[1];
      }
      input = input.trim();
    }
    if (input.startsWith(")")) input = input.slice(1).trim();

    const output = functn(params);

    return output || output === false || output === 0 ? [output[0] || output, input] : null; 
  }
  return null;
}

function defineParser(input, env) {
  //variable
  const [variable, remainingInput1] = operandParser(input.trim(), env);
  //value
  const [value, remainingInput2] = parser(remainingInput1.trim(), env);
  input = remainingInput2.trim();

  if (input.startsWith(")")) input = input.slice(1).trim();

  env[variable] = value;
  return [value, input];
}

function beginParser(input, env) {
  let result;
  while (input.trim().startsWith("(")) {
    const temp = parser(input.trim(), env);
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
  if (input.trim().startsWith("(")) input = input.trim().slice(1).trim();
  const args = [];
  //arguments
  while (!input.trim().startsWith(")")) {
    const [result, remainingInput] = operandParser(input.trim(), env) || [];
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
    const result = parser(body, lambdaEnv) || [];
    return result;
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
  const [condition, remainingInput] = parser(input.trim(), env) || [];
  if (condition) {
    //arg1
    const [result, remainingInput2] = parser(remainingInput.trim(), env) || [];
    //arg2 - string
    if (remainingInput2.trim().startsWith("(")) {
      input = ifStringParserBracketParser(remainingInput2.trim());
    } else {
      input = operandParser(remainingInput2.trim())[1];
    }
    if (input.startsWith(")")) input = input.slice(1).trim();
    return [result, input.trim()];
  } else {
    if (remainingInput.trim().startsWith("(")) {
      input = ifStringParserBracketParser(remainingInput.trim());
    } else {
      input = operandParser(remainingInput.trim())[1];
    }
    //arg2
    let [result, remainingInput2] = parser(input.trim(), env) || [];

    if (remainingInput2.trim().startsWith(")"))
      input = remainingInput2.trim().slice(1);

    return [result, input.trim()];
  }
}

function quoteParser(input, env) {
  const result = bracketParser(input.trim());
  return result;
}

function setParser(input, env) {
  //variable
  const [variable, remainingInput1] = operandParser(input.trim());
  if (!env.hasOwnProperty(variable)) return null;
  //value
  const [value, remainingInput2] = parser(remainingInput1.trim(), env);
  //assignment
  env[variable] = value;
  if (remainingInput2.trim().startsWith(")"))
    input = remainingInput2.trim().slice(1);
  return [value, input.trim()];
}

function operandParser(input) {
  let i = 0;
  while (input[i] !== " " && i < input.length && input[i] !== ")" && input[i] !== "(" ) { i++; }
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
  const result = operandParser(input);
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
      if ( !["b", "f", "n", "r", "t", "\\", "/", '"', "u"].includes(input[i + 1])) { return null; }
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
  while (input !== null && input !== ")" && input !== "") {
    const [result, remainingInput] = parser(input, env) || [];
    if (result === null || result === undefined) break;
    if (remainingInput === ")") {
      output.push([result, { error: "syntax error extra ')'" }]);
      break;
    }
    output.push(result);
    input = remainingInput;
  }
  return output.length < 1 ? null : output;
}

module.exports = {
  parser,
  globalEnv,
  main,
};
