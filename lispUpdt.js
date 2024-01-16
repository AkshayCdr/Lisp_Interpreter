// import { valueParser } from "./jsonParser";

// import { numberParser } from "./jsonParser";

function Env() {
  let global_env = {
    "+": function (args) {
      return args.reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    },
    // "-": function (args) {
    //   return args.reduce((acc, curr) => {
    //     return acc - curr;
    //   }, 0);
    // },
    "-": function (args) {
      let result = args[0];
      if (args.length < 2) {
        return result;
      }
      for (let i = 1; i < args.length; i++) {
        result -= args[i];
      }
      return result;
    },
    "*": function (args) {
      return args.reduce((acc, curr) => {
        return acc * curr;
      }, 1);
    },
    "/": function (args) {
      let length = args.length;
      if (length === 2) {
        return args[0] / args[1];
      }
      return null;
    },
    ">": function (args) {
      let length = args.length;
      if (length === 2) {
        return args[0] > args[1];
      }
      return null;
    },
    ">=": function (args) {
      let length = args.length;
      if (length === 2) {
        return args[0] >= args[1];
      }
      return null;
    },
    "<": function (args) {
      let length = args.length;
      if (length === 2) {
        return args[0] < args[1];
      }
      return null;
    },
    "<=": function (args) {
      let length = args.length;
      if (length === 2) {
        return args[0] <= args[1];
      }
      return null;
    },
    define: function (variable, value) {
      global_env[variable] = value;
      return value;
    },
    pi: function () {
      return Math.PI;
    },
    pow: function (args) {
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
    append: function (a, b) {
      return String(a) + String(b);
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
    max: function (args) {
      return Math.max(...args);
    },
    min: function (args) {
      return Math.min(...args);
    },
    // round: function (a) {
    //   return Math.round(a);
    // },
    // not: function (a) {
    //   return !a;
    // },
    // "number?": function (a) {
    //   return !isNaN(a);
    // },
    // begin: (...args) => {
    //   return args[args.length - 1];
    // },
    // begin: (...args) => args[args.length - 1],
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

// let str = "(define circle-area (lambda (r) (* 3.14 (* r r))))";
// let str = "(define (abs x) (* x x))";
// (define square (lambda (x y) (* x x y) ))
// (square 9 10)function temp(env) {
//   let string1 = "(define circle-area (lambda (r) (* 3.14 (* r r))))";
//   let string2 = "(circle-area 5)";

//   let result1 = parser(string1, env);
//   let result2 = parser(string2, env);
//   console.log(result1);
//   console.log(result2);
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

  let string1 =
    "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))";
  let string2 = "(fact 2)";

  let result1 = parser(string1, env);
  let result2 = parser(string2, env);
  console.log(result1);
  console.log(result2);
}

temp(env);
// console.log(parser(str, env));

function expressionParser(string, env) {
  string = string.trim();
  let fun;
  if (string.startsWith("(")) {
    string = string.slice(1);
    //get function
    let result = parser(string);
    fun = result[0];
    string = result[1];
  } else {
    return null;
  }
  if (Object.prototype.hasOwnProperty.call(env, fun)) {
    for (let i in env) {
      if (i === fun) {
        if (typeof env[i] === "function") {
          //no arg , single arg, multiple arg
          //   if (fun === "pi") {
          //     return [env[i](), string.slice(2)];
          //   }
          let params = [];
          while (!string.trim().startsWith(")")) {
            let result = parser(string, env);
            if (result) {
              if (result[0] === "pi") {
                params.push(env[result[0]]());
              } else if (env[result[0]]) {
                params.push(env[result[0]]);
                // if () {
                //   params.push(env[result[0]]);
                // }
              } else {
                params.push(result[0]);
              }
              string = result[1];
            }
            string = string.trim();
          }
          let output = env[i](params);
          if (output || output === false) {
            return [env[i](params), string];
          } else {
            return null;
          }
        } else {
          return [env(i), string];
        }
      }
    }
  } else {
    return [fun, string];
  }
}

// function varibleParser(string, env) {
//   string = string.trim()
//   //name
//   //variable
//   // env['name'] : function(variable)
//   //body

// }

function defineParser(string, env) {
  string = string.trim();
  let result;
  //variable
  result = parser(string, env);
  let variable = result[0];
  string = result[1];

  string = string.trim();
  //value
  result = parser(string, env);
  let value = result[0];
  string = result[1];

  env["define"](variable, value);
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

function bodyParser(string, env) {
  let i;
  for (i = 0; i < string.length; i++) {
    i++;
  }
  return [string.substring(0, i), string.slice(i)];
}

function lambdaParser(string, env) {
  //return function
  //define the function into env
  //how to parse the body of the function
  //   (define circle-area (lambda (r) (* 3.14 (* r r))))
  string = string.trim();
  //args
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

  //function

  let temp = (param) => {
    // let lambdaEnv = new Env();
    let i = 0;
    while (i < args.length) {
      //   lambdaEnv[args[i]] = param[i];
      env[args[i]] = param[i];
      i++;
    }
    // let result = parser(body[0], lambdaEnv);
    let result = parser(body[0], env);
    return [result[0], result[1]];
  };
  return [temp, body[0]];
  //function (..args)
  // lambdastringparser
  //let lambda env = new env
  //if start with (
  //parser fun === env
  //arg1 fun arg2
  //return function
  //
}

function ifParser(string, env) {
  string = string.trim();

  let condition = parser(string, env);
  if (condition[1]) {
    string = condition[1];
  }
  condition = condition[0];

  string = string.trim();
  if (string.startsWith(")")) {
    string = string.slice(1);
  }
  string = string.trim();

  //arg1
  let arg1 = parser(string, env);
  if (arg1[1]) {
    string = arg1[1];
  }
  let result1 = arg1[0] || arg1;

  string = string.trim();
  if (string.startsWith(")")) {
    string = string.slice(1);
  }
  string = string.trim();

  //arg2
  let arg2 = parser(string, env);
  if (arg2[1]) {
    string = arg2[1];
  }
  let result2 = arg2[0] || arg2;

  if (condition) {
    return [result1, string];
  } else {
    return [result2, string];
  }
}

function specialParser(string, env) {
  string = string.trim();
  let fun;
  if (string.startsWith("(")) {
    string = string.slice(1);
    let result = parser(string);
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
// function stringParser(string) {
//   //   let regex = /\w+/;
//   let regex = /[^\\s]+/;
//   let result = string.match(regex);
//   return [result[0], string.slice(result[0].length)];
// }

function numberParser(input) {
  let regex = /^[-+]?([1-9]\d*|0)(\.\d*)?([Ee][+-]?\d+)?/;
  let result = input.match(regex);
  if (result) return [parseFloat(result[0]), input.slice(result[0].length)];
  return null;
}

function parser(string, env) {
  let result;
  result = specialParser(string, env);
  if (result) {
    return result;
  }
  result = expressionParser(string, env);
  if (result) {
    return result;
  }
  result = numberParser(string, env);
  if (result) {
    return result;
  }
  result = stringParser(string, env);
  if (result) {
    return result;
  }
}

//tem working define begin and expressions
//working on lambda
