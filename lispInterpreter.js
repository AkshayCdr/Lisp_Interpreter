let globalEnv = {
  "+": (args) => args.reduce((acc, curr) => acc + curr, 0),
  "-": (args) => args.reduce((acc, curr) => acc - curr),
  "*": (args) => args.reduce((acc, curr) => acc * curr, 1),
  "/": (args) => {
    let length = args.length;
    if (length === 2) return args[0] / args[1];
    return null;
  },
  ">": (args) => {
    let length = args.length;
    if (length === 2) return args[0] > args[1];
    return null;
  },
  ">=": (args) => {
    let length = args.length;
    if (length === 2) return args[0] >= args[1];
    return null;
  },
  "<": (args) => {
    let length = args.length;
    if (length === 2) return args[0] < args[1];
    return null;
  },
  "<=": (args) => {
    let length = args.length;
    if (length === 2) return args[0] <= args[1];
    return null;
  },
  pi: Math.PI,
  pow: (args) => {
    if (args.length === 2) return Math.pow(args[0], args[1]);
    return null;
  },
  length: (args) => args.length,
  abs: function (args) {
    if (args.length === 1) return Math.abs(args[0]);
    return null;
  },
  "equal?": function (args) {
    if (args.length === 2) return args[0] === args[1];
    return null;
  },
  sqrt: function (args) {
    if (args.length === 1) return Math.sqrt(args[0]);
    return null;
  },
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
  const result = tokenParser(input);
  if (result === null) return null;
  const value = result[0];
  const set = new Set(["define", "begin", "if", "lambda", "quote", "set!"]);
  if (!set.has(value)) return null;
  input = result[1];
  const specialParsers = {
    define: defineParser,
    begin: beginParser,
    if: ifParser,
    lambda: lambdaParser,
    quote: quoteParser,
    "set!": setParser,
  };

  const output = specialParsers[value](input, env);
  if (output === null) return null;
  return [output[0], output[1]];
}

function expressionParser(input, env) {
  input = input.trim();
  if (!input.startsWith("(")) {
    return null;
  }
  input = input.slice(1);
  input = input.trim();

  if (input.startsWith(")")) {
    input = input.slice(1);
    return ["()", input];
  }

  let res = specialParser(input, env);
  if (res !== null) {
    return [res[0], res[1]];
  }

  //get function
  let result = parser(input, env);
  if (result === null) {
    return null;
  }
  let functn;
  functn = result[0];
  input = result[1];
  if (functn !== undefined || functn !== null) {
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
      if (input.startsWith(")")) {
        input = input.slice(1);
      }
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
  } else {
    return null;
  }
}

function defineParser(input, env) {
  input = input.trim();
  // input = input.slice(6);
  input = input.trim();

  let result;
  //variable
  result = tokenParser(input, env);
  const variable = result[0];
  input = result[1];

  input = input.trim();

  //value
  result = parser(input, env);
  const value = result[0];
  input = result[1];

  input = input.trim();

  if (input.startsWith(")")) {
    input = input.slice(1);
  }

  input = input.trim();

  env[variable] = value;
  return [value, input];
}

function beginParser(input, env) {
  input = input.trim();
  // input = input.slice(5);
  input = input.trim();

  let temp;
  let result;
  while (input.trim().startsWith("(")) {
    // string = string.slice(1);
    input = input.trim();
    temp = parser(input, env);
    if (temp === null) {
      return null;
    }
    result = temp[0];
    input = temp[1];
    if (input.startsWith(")")) {
      input = input.slice(1);
      input = input.trim();
    }
  }
  return [result, input];
}

function bracketParser(input) {
  let i = 0;
  let stack = [];
  while (i < input.length) {
    if (input[i] === "(") {
      stack.push(input[i]);
    }
    if (input[i] === ")") {
      let temp = stack.pop();
      if (temp !== "(") {
        break;
      }
    }
    i++;
  }
  return [input.substring(0, i), input.slice(i + 1)];
}

function lambdaParser(input, env) {
  input = input.trim();
  // input = input.slice(6);
  input = input.trim();

  if (input.startsWith("(")) {
    input = input.slice(1);
  }
  input = input.trim();

  const args = [];
  //arguments
  while (!input.startsWith(")")) {
    const result = tokenParser(input, env);
    if (result) {
      args.push(result[0]);
      input = result[1];
    }
  }
  //remove )
  if (input.startsWith(")")) {
    input = input.slice(1);
  }
  input = input.trim();
  //body
  const body = bracketParser(input, env);

  let innerFunction = (param) => {
    const lambdaEnv = { ...env };
    let i = 0;
    while (i < args.length) {
      lambdaEnv[args[i]] = param[i];
      i++;
    }
    const result = parser(body[0], lambdaEnv);
    return [result[0], result[1]];
  };
  //temp code
  env[innerFunction] = body[0];
  input = body[1];
  return [innerFunction, input];
}

function ifStringParser(input) {
  let i = 0;
  while (input[i] !== ")") {
    i++;
  }
  return input.slice(i + 1);
}

function ifParser(input, env) {
  input = input.trim();
  // input = input.slice(2);
  input = input.trim();
  const result = parser(input, env);
  if (result[1]) {
    input = result[1];
  }
  const condition = result[0];

  // string = removeSpaceAndBracket(string);
  input = input.trim();

  if (condition) {
    //arg1
    let res = parser(input, env);
    input = res[1];
    //arg2
    input = input.trim();
    if (input.startsWith("(")) {
      input = ifStringParser(input);
    } else {
      input = tokenParser(input)[1];
    }
    if (input.startsWith(")")) {
      input = input.slice(1);
    }
    input = input.trim();

    return [res[0], input];
  } else {
    input = input.trim();
    if (input.startsWith(")")) {
      input = input.slice(1);
    }
    input = input.trim();
    //arg1
    input = input.trim();
    if (input.startsWith("(")) {
      input = ifStringParser(input);
    } else {
      input = tokenParser(input)[1];
    }
    input = input.trim();
    //arg2
    let res = parser(input, env);

    input = res[1];
    input = input.trim();

    if (input.startsWith(")")) {
      input = input.slice(1);
    }
    input = input.trim();

    return [res[0], input];
  }
}

function quoteParser(input, env) {
  input = input.trim();
  // input = input.slice(5);
  input = input.trim();
  const result = bracketParser(input);
  // return result;
  return [result[0], result[1]];
}

function setParser(input, env) {
  input = input.trim();
  // input = input.slice(4);
  input = input.trim();
  //variable
  let result = tokenParser(input);
  const variable = result[0];
  if (!env.hasOwnProperty(variable)) {
    return null;
  }

  input = result[1];
  //value
  input = input.trim();
  result = parser(input, env);
  input = result[1];
  const value = result[0];
  env[variable] = value;
  if (input.startsWith(")")) {
    input = input.slice(1);
  }
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
        if (!input.slice(i + 2).match(/^[0-9a-fA-F]{4}/)) {
          return null;
        }
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
