// import { valueParser } from "./jsonParser";

// import { numberParser } from "./jsonParser";

function Env() {
  const global_env = {
    "+": function (a, b) {
      return a + b;
    },
    "-": function (a, b) {
      if (b == null) return -a;
      return a - b;
    },
    "*": function (a, b) {
      return a * b;
    },
    "/": function (a, b) {
      return a / b;
    },
    ">": function (a, b) {
      return a > b;
    },
    ">=": function (a, b) {
      return a >= b;
    },
    "<": function (a, b) {
      return a < b;
    },
    "<=": function (a, b) {
      return a <= b;
    },
    // define: function (a, b) {
    //   a = b;
    //   return a;
    // },
    define: function (variable, value) {
      global_env[variable] = value;
      return value;
    },
    pi: function () {
      return 3.14;
    },
    pow: function (a, b) {
      return Math.pow(a, b);
    },
    length: function (a) {
      return a.length;
    },
    abs: function (a) {
      return Math.abs(a);
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
    car: function (a) {
      return a[0];
    },
    cdr: function (a) {
      return a[1];
    },
    cons: function (a, b) {
      a.push(b);
      return a;
    },
    sqrt: function (a) {
      return Math.sqrt(a);
    },
    max: function (a) {
      return Math.max(a);
    },
    min: function (a) {
      return Math.min(a);
    },
    round: function (a) {
      return Math.round(a);
    },
    not: function (a) {
      return !a;
    },
    "number?": function (a) {
      return !isNaN(a);
    },
    // begin: (...args) => {
    //   return args[args.length - 1];
    // },
    fact: function (a) {
      let answer = 1;
      if (a == 0 || a == 1) {
        return answer;
      } else if (a > 1) {
        for (var i = a; i >= 1; i--) {
          answer = answer * i;
        }
        return answer;
      } else {
        return null;
      }
    },
  };
  return global_env;
}

function stringParser(string) {
  let i = 0;
  while (string[i] !== " " && i < string.length && string[i] !== ")") {
    i++;
  }
  return [string.substring(0, i), string.slice(i + 1)];
}

function numberParser(input) {
  let regex = /^[-+]?([1-9]\d*|0)(\.\d*)?([Ee][+-]?\d+)?/;
  let result = input.match(regex);
  if (result) return [parseFloat(result[0]), input.slice(result[0].length)];
  return null;
}

// let str = "(* pi 7)";
// let str = "(max 4(* 2 (* 3 4)))";
// let str = "(6)";
// let str = "(+ 1 2)";
// let str = "(fact 5)";
// let str = "(pow 2 16)";
// let str = "(* pi (* 3 2)))";
// let str = "(* pi 6)";
// let str = "(define r 5)";
// let str = "(define r 5)((* pi (* r r))))";

console.log(parserFormatter(str));
// parser(str);

function parserFormatter(string) {
  if (!string.startsWith("(")) {
    return null;
  }
  // let regexLeft = /\(/g;
  // let regexRight = /\)/g;
  // let leftBracketArr = string.match(regexLeft).length;
  // let righBrackerArr = string.match(regexRight).length;
  // if (leftBracketArr !== righBrackerArr) {
  //   return null;
  // }
  let result = parser(string);
  //   console.log(result);
  return result[0];
}

function parser(string) {
  let env = Env();
  if (!string) return null;
  string = string.trim();
  if (string.startsWith("(")) {
    string = string.slice(1);
  }
  string = string.trim();
  if (numberParser(string)) {
    let result = numberParser(string);
    return result;
  }
  if (stringParser(string)) {
    let result = stringParser(string);
    let fun = result[0];
    string = result[1];
    if (Object.prototype.hasOwnProperty.call(env, fun)) {
      if (fun === "define") {
        let variable = parser(string);
        if (variable[1]) {
          string = variable[1];
        }
        variable = variable[0] || variable;

        if (string.trim()) {
          string = string.trim();
        }

        let value = parser(string);
        if (value[1]) {
          string = value[1];
        }
        value = value[0] || value;

        return [env.define(variable, value), string];
      } else {
        for (let i in env) {
          if (i === fun) {
            if (typeof env[i] === "function") {
              let arg1 = parser(string);
              if (arg1[1]) {
                string = arg1[1];
              }
              arg1 = arg1[0] || arg1;

              //check for white spaces

              if (string.trim()) {
                string = string.trim();
              }

              if (string.startsWith(")")) {
                //hack change the code
                if (i === "pi") {
                  return [env[i](), arg1.toString()];
                } else {
                  return [env[i](arg1), string];
                }
              }
              let arg2 = parser(string);
              if (arg2[1]) {
                string = arg2[1];
              }
              arg2 = arg2[0] || arg2;
              return [env[i](arg1, arg2), string];
            }
          }
        }
      }
    } else {
      return [fun, string];
    }
  }
}
