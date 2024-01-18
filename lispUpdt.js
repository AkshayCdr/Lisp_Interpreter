// import { valueParser } from "./jsonParser";

// import { numberParser } from "./jsonParser";
const { strings } = require("./lispTests");

function Env() {
  let global_env = {
    "+": (args) => args.reduce((acc, curr) => acc + curr, 0),
    "-": (args) => {
      let result = args[0];
      if (args.length < 2) {
        return result;
      }
      for (let i = 1; i < args.length; i++) {
        result -= args[i];
      }
      return result;
    },
    "*": (args) => args.reduce((acc, curr) => acc * curr, 1),
    "/": (args) => {
      let length = args.length;
      if (length === 2) {
        return args[0] / args[1];
      }
      return null;
    },
    ">": (args) => {
      let length = args.length;
      if (length === 2) {
        return args[0] > args[1];
      }
      return null;
    },
    ">=": (args) => {
      let length = args.length;
      if (length === 2) {
        return args[0] >= args[1];
      }
      return null;
    },
    "<": (args) => {
      let length = args.length;
      if (length === 2) {
        return args[0] < args[1];
      }
      return null;
    },
    "<=": (args) => {
      let length = args.length;
      if (length === 2) {
        return args[0] <= args[1];
      }
      return null;
    },
    pi: Math.PI,
    pow: (args) => {
      if (args.length === 2) {
        return Math.pow(args[0], args[1]);
      }
      return null;
    },
    length: function (a) {
      return a.length;
    },
    abs: function (args) {
      if (args.length === 1) {
        return Math.abs(args[0]);
      }
      return null;
    },
    "eq?": function (a, b) {
      return a == b;
    },
    "equal?": function (a, b) {
      return a === b;
    },
    sqrt: function (args) {
      if (args.length === 1) {
        return Math.sqrt(args[0]);
      }
      return null;
    },
    max: (args) => Math.max(...args),
    min: (args) => Math.min(...args),
    list: (...args) => args,
    car: (args) => args[0],
    cdr: (args) => args.join("").slice(1).split(""),
  };
  return global_env;
}

let env = new Env();

// let str = "(+ 1 2 3)";
// let str = "(+ 1 2 3 4 4 3 2)";
// let str = "(1)";
// let str = "(/ 4 2)";
// let str = "(> 2 1)";
// let str = "(- 1 2 3)";
// let str = "(* pi 100)";
// let str = "(define r 100)";
// let str = "(begin (define r 10) (* r r))";
// let str = "(begin (define r 10) (* pi (* r r)))";
// let str = "(if (> 5 10) (* 5 10) (* 5 100))";
// let str = "(if (> 5 10) 5 10)";
// let str = "((if (> 5 4) + *) 4 3)";
// let str = " (if (> (* 11 11) 120) (* 7 6) oops)";
// let str = "(begin (define r 20) ((if (> 4 5) + -) r r))";
// let str = "((if (> 4 5) + -) 5 9)";
// let str = "(begin (define r 20) (define l ((if (< 4 5) + -) r r)) (* r l))";
// let str = "(1)";
// let str = "(#f)";
// let str = "(string)";
// let str = "(define circle-area (lambda (r) (* 3.14 (* r r))))";
// let str = "(define (abs x) (* x x))";
// let str = "(define circle-area (lambda (r) (* 3.14 (* r r))))";
// let string2 = "(circle-area 5)";
// let str = "((if #f + *) 3 4)";
// let str = "(if #t 3  )";
// let str = "(if #f 3 4)";
// let str = "((lambda (x) (+ x x)) 4)";
// let str = "(define define 10)";
// let str = "define";
// let str = "()";
// let result1 = parser(string1, env);
// let result2 = parser(string2, env);
// console.log(result1);
// console.log(result2);
// }

// temp(env);

// let str = "(lambda (x y) (* x x y))";
// const readline = require("readline").createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// function formatter(env) {
//   return readline.question("lisp>>", (string) => {
//     console.log(parser(string, env)[0]);
//     if (string === "exit") {
//       readline.close();
//     } else {
//       formatter(env);
//     }
//   });
// }

// formatter(env);

function temp(env) {
  //   let string1 = "(define circle-area (lambda (r) (* 3.14 (* r r))))";
  //   let string2 = "(circle-area 5)";
  // let string1 =
  //   "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))";
  // let string2 = "(fact 5)";
  // let string1 = "(list (0 1 2 3 4))";
  let string1 = "((lambda (x) (+ x x)) 4)";

  //   let string1 = "(define define 10)";
  //   let string2 = "define";
  let result1 = parser(string1, env);
  // let result2 = parser(string2, env);
  console.log(result1);
  // console.log(result2);
}

temp(env);

// console.log(parser(str, env));
// ---------------------------------------------------------------
// for (let i of strings()) {
//   console.log(i);
//   console.log(parser(i, env));
// }

// console.log(strings().map((i) => parser(i, env)));

// console.log(
//   strings().map((i) => {
//     return [i, parser(i, env)];
//   })
// );
// --------------------------------------------------------------------
function expressionParser(string, env) {
  string = string.trim();
  if (!string.startsWith("(")) {
    return null;
  }
  let fun;
  if (string.slice(1).startsWith(")")) {
    return [string, string.slice(2)];
  }
  string = string.slice(1);

  //get function
  let result = parser(string, env);
  fun = result[0];
  string = result[1];
  if (fun !== undefined || fun !== null) {
    if (typeof fun === "number" || typeof fun === "boolean") {
      return [fun, string];
    }
    if (Object.prototype.hasOwnProperty.call(env, fun)) {
      for (let i in env) {
        if (i === fun) {
          if (typeof env[i] === "function") {
            let params = [];
            while (!string.trim().startsWith(")")) {
              let result = parser(string, env);
              if (result) {
                if (env[result[0]]) {
                  params.push(env[result[0]]());
                } else {
                  params.push(result[0]);
                }
                string = result[1];
              }
              string = string.trim();
            }
            if (string.startsWith(")")) {
              string = string.slice(1);
            }
            let output = env[i](params);
            if (output || output === false || output === 0) {
              if (output[0]) {
                return [output[0], string];
              }
              return [output, string];
            } else {
              return null;
            }
          } else {
            return [env(i), string];
          }
        }
      }
    } else {
      //   return [fun, string];
      return null;
    }
  } else {
    return null;
  }
}

function defineParser(string, env) {
  string = string.trim();
  let result;
  //variable
  result = stringParser(string, env);
  let variable = result[0];
  string = result[1];

  string = string.trim();
  //value
  result = parser(string, env);
  let value = result[0];
  string = result[1];

  if (string.startsWith(")")) {
    string = string.slice(1);
  }
  env[variable] = value;
  return [value, string];
}

function beginParser(string, env) {
  string = string.trim();
  let temp;
  let result;
  while (string.trim().startsWith("(")) {
    // string = string.slice(1);
    string = string.trim();
    temp = parser(string, env);
    result = temp[0];
    string = temp[1];
    if (string.startsWith(")")) {
      string = string.slice(1);
      string = string.trim();
    }
  }
  return [result, string];
}

function bodyParser(string) {
  let i = 0;
  let stack = [];
  while (i < string.length) {
    if (string[i] === "(") {
      stack.push(string[i]);
    }
    if (string[i] === ")") {
      let temp = stack.pop();
      if (temp !== "(") {
        break;
      }
    }
    i++;
  }

  return [string.substring(0, i), string.slice(i + 1)];
}

function lambdaParser(string, env) {
  string = string.trim();
  if (string.startsWith("(")) {
    string = string.slice(1);
  }
  string = string.trim();

  let args = [];
  while (!string.startsWith(")")) {
    let result = parser(string, env);
    if (result) {
      args.push(result[0]);
      string = result[1];
    }
  }
  //remove )
  if (string.startsWith(")")) {
    string = string.slice(1);
  }
  string = string.trim();
  //body
  let body = bodyParser(string, env);

  let temp = (param) => {
    let lambdaEnv = { ...env };
    let i = 0;
    while (i < args.length) {
      lambdaEnv[args[i]] = param[i];
      //   env[args[i]] = param[i];
      i++;
    }
    let result = parser(body[0], lambdaEnv);
    // let result = parser(body[0], env);
    return [result[0], result[1]];
  };
  return [temp, body[0]];
}

function ifStringParser(string) {
  let i = 0;
  while (string[i] !== ")") {
    i++;
  }
  return string.slice(i + 1);
}

function ifParser(string, env) {
  string = string.trim();
  let result = parser(string, env);
  if (result[1]) {
    string = result[1];
  }
  let condition = result[0];

  string = string.trim();
  if (string.startsWith(")")) {
    string = string.slice(1);
  }
  string = string.trim();

  if (condition) {
    //arg1
    let res = parser(string, env);
    string = res[1];
    //arg2

    string = string.trim();
    if (string.startsWith("(")) {
      string = ifStringParser(string);
    } else {
      string = stringParser(string)[1];
    }
    if (string.startsWith(")")) {
      string = string.slice(1);
    }
    string = string.trim();

    return [res[0], string];
  } else {
    string = string.trim();
    if (string.startsWith(")")) {
      string = string.slice(1);
    }
    string = string.trim();
    //arg1

    string = string.trim();
    if (string.startsWith("(")) {
      string = ifStringParser(string);
    } else {
      string = stringParser(string)[1];
    }
    string = string.trim();
    //arg2
    let res = parser(string, env);

    string = res[1];
    string = string.trim();

    if (string.startsWith(")")) {
      string = string.slice(1);
    }
    string = string.trim();

    return [res[0], string];
  }
}

function specialParser(string, env) {
  string = string.trim();
  let fun;
  if (string.startsWith("(")) {
    string = string.slice(1);
    let result = stringParser(string, env);
    fun = result[0];
    string = result[1];
  } else {
    return null;
  }

  if (fun === "define") {
    let res = defineParser(string, env);
    return [res[0], res[1]];
  } else if (fun === "begin") {
    let res = beginParser(string, env);
    return [res[0], res[1]];
  } else if (fun === "if") {
    let res = ifParser(string, env);
    return [res[0], res[1]];
  } else if (fun === "lambda") {
    //lambda parser
    let res = lambdaParser(string, env);
    return [res[0], res[1]];
  } else {
    return null;
  }

  //if define
  //if begin
  //if lambda
  //if set
  //if quote
  // return 0;
}

function stringParser(string) {
  let i = 0;
  while (string[i] !== " " && i < string.length && string[i] !== ")") {
    i++;
  }
  if (string[i] === ")") {
    return [string.substring(0, i), string.slice(i)];
  }
  return [string.substring(0, i), string.slice(i + 1)];
}

function numberParser(input) {
  let regex = /^[-+]?([1-9]\d*|0)(\.\d*)?([Ee][+-]?\d+)?/;
  let result = input.match(regex);
  if (result) return [parseFloat(result[0]), input.slice(result[0].length)];
  return null;
}

function valueParser(string, env) {
  let result = stringParser(string);
  let value = result[0];
  string = result[1];
  if (Object.prototype.hasOwnProperty.call(env, value)) {
    if (typeof env[value] === "function") {
      return [value, string];
    }
    return [env[value], string];
  } else {
    return [value, string];
  }
  //   return null;
}

function booleanParser(input) {
  if (input.startsWith("#t")) {
    return [true, input.slice(2)];
  }
  if (input.startsWith("#f")) {
    return [false, input.slice(2)];
  }
  return null;
}

function parser(string, env) {
  result = stringParser(string, env);
  if (result) {
    return result;
  }

  let parsers = [
    specialParser,
    expressionParser,
    numberParser,
    booleanParser,
    valueParser,
    stringParser,
  ];
  for (let i of parsers) {
    let result = i(string, env);
    if (result) {
      return result;
    }
  }
}
