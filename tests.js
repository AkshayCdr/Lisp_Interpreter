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
// let str = "(circle-area 5)";
// let str = "((if #f + *) 3 4)";
// let str = "(if #t 3  )";
// let str = "(if #f 3 4)";
// let str = "((lambda (x) (+ x x)) 4)";
// let str = "(define define 10)";
// let str = "define";
// let str = "()";
// let str = "(define first car)";
// let str = "(list (1 2 3 4 5))";
// let str = "(define twice (lambda (x) (* 2 x)))";
// let str = "(twice 5)";
// let str = "(define repeat (lambda (f) (lambda (x) (f (f x)))))";
// let str = "((repeat twice) 10)";

// let test1 = {
//   input: "(+ 1 2 3)",
//   output: 6,
// };
// let test2 = {
//   input: "(begin (define r 10) (* pi (* r r)))",
//   output: Math.PI * 100,
// };
// let test3 = {
//   input: "(define circle-area (lambda (r) (* 3.14 (* r r))))",
//   output: "function",
// };
// let test4 = {
//   input: "(circle-area 5)",
//   output: 314,
// };

// let test5 = {
//   input: "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))",
//   output: "function",
// };

// let test6 = {
//   input: "(fact 10)",
//   output: 3628800,
// };

// let test7 = {
//   input: "(circle-area (fact 10))",
//   output: 41348114841600,
// };

// let test8 = {
//   input: "(define define 10)",
//   output: 10,
// };

// let test9 = {
//   input: "()",
//   output: "()",
// };

// let test10 = {
//   input: "(",
//   output: "",
// };
// let test11 = {
//   input: "(list (1 2 3 4 5))",
//   output: [1, 2, 3, 4, 5],
// };

// let test12 = {
//   input: "((if #f + *) 3 4)",
//   output: 12,
// };

// let test13 = {
//   input: "(define twice (lambda (x) (* 2 x)))",
//   output: "function",
// };

// let test14 = {
//   input: "(twice 5)",
//   output: 10,
// };

// let test15 = {
//   input: "(define repeat (lambda (f) (lambda (x) (f (f x)))))",
//   output: "function",
// };

// let test16 = {
//   input: "((repeat twice) 10)",
//   output: 40,
// };

// let test17 = {
//   input: "((repeat (repeat twice)) 10)",
//   output: 160,
// };

// const test18 = {
//   input: "((repeat (repeat (repeat twice))) 10)",
//   output: 2560,
// };

// const test19 = {
//   input: "((repeat (repeat (repeat (repeat twice)))) 10)",
//   output: 655360,
// };

// const test20 = {
//   input: "(define a 5)",
//   output: 5,
// };

// const test21 = {
//   input: "(set! a 8)",
//   output: 8,
// };

// const test22 = {
//   input: "(quote (a b c))",
//   output: "(a b c)",
// };

// const test23 = {
//   input: "(- 1)",
//   output: -1,
// };

// const test24 = {
//   input: "(-1)",
//   output: "",
// };

// const test25 = {
//   input: "(if (> (* 11 11) 120) (* 7 6) oops)",
//   output: 42,
// };

// const test26 = {
//   input: "(begin (define r 20) (define l ((if (< 4 5) + -) r r)) (* r l))",
//   output: 800,
// };

// const test27 = {
//   input: "(define if 60)",
//   output: 60,
// };

// const test28 = {
//   input: "if",
//   output: 60,
// };

const tests = [
  {
    input: "(+ 1 2 3)",
    output: 6,
  },
  {
    input: "(begin (define r 10) (* pi (* r r)))",
    output: Math.PI * 100,
  },
  {
    input: "(define circle-area (lambda (r) (* 3.14 (* r r))))",
    output: "function",
  },
  {
    input: "(circle-area 5)",
    output: 78.5,
  },

  {
    input: "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))",
    output: "function",
  },
  {
    input: "(fact 10)",
    output: 3628800,
  },

  {
    input: "(circle-area (fact 10))",
    output: 41348114841600,
  },

  {
    input: "(define define 10)",
    output: 10,
  },

  {
    input: "()",
    output: "()",
  },
  {
    input: "(",
    output: null,
  },
  {
    input: "(list 1 2 3 4 5 )",
    output: [1, 2, 3, 4, 5],
  },
  {
    input: "((if #f + *) 3 4)",
    output: 12,
  },

  {
    input: "(define twice (lambda (x) (* 2 x)))",
    output: "function",
  },

  ,
  {
    input: "(twice 5)",
    output: 10,
  },

  {
    input: "(define repeat (lambda (f) (lambda (x) (f (f x)))))",
    output: "function",
  },

  {
    input: "((repeat twice) 10)",
    output: 40,
  },

  {
    input: "((repeat (repeat twice)) 10)",
    output: 160,
  },

  {
    input: "((repeat (repeat (repeat twice))) 10)",
    output: 2560,
  },

  {
    input: "((repeat (repeat (repeat (repeat twice)))) 10)",
    output: 655360,
  },

  {
    input: "(define a 5)",
    output: 5,
  },

  {
    input: "(set! a 8)",
    output: 8,
  },

  {
    input: "(quote (a b c))",
    output: "(a b c)",
  },

  {
    input: "(- 1)",
    output: -1,
  },

  {
    input: "(-1)",
    output: null,
  },

  {
    input: "(if (> (* 11 11) 120) (* 7 6) oops)",
    output: 42,
  },

  {
    input: "(begin (define r 20) (define l ((if (< 4 5) + -) r r)) (* r l))",
    output: 800,
  },

  {
    input: "(define if 60)",
    output: 60,
  },

  {
    input: "if",
    output: 60,
  },
  {
    input: "(+ 3 4)(* 2 3)",
    output: [7, 6],
  },
  {
    input: "()(* 2 3)",
    output: ["()", 6],
  },
  {
    input: "((if (< 5 4) + -) (+ 45 3)) (- 45 3))",
    output: [-48, [42, { error: "syntax error extra ')'" }]],
  },
  {
    input: "defined 4",
    output: null,
  },
  {
    input: "(quote (a b c)))",
    output: ["(a b c)", { error: "syntax error extra ')'" }],
  },
  {
    input: '"this is a string"',
    output: "this is a string",
  },
  {
    input: '(define a "kjk")',
    output: "kjk",
  },
  {
    input: "(quote (+ 1 1)))",
    output: "(+ 1 1)",
  },
  {
    input: "(begin (define x 2 ) (+ x 1) (set! x 4) (+ x 1))",
    output: 5,
  },
  {
    input: "(begin (define area (lambda (l b) (* l b))) (area 2 3))",
    output: 6,
  },
  {
    input:
      "(begin (define circle-area (lambda (r) (* pi (* r r)))) (circle-area 10))",
    output: Math.PI * 100,
  },
  {
    input: "(define x (+ 5 5))",
    output: 10,
  },
  {
    input: "( + ( + ( + 9 ( + 2 2)) 2) ( - 3 4) )",
    output: 14,
  },
  {
    input: "(begin (define r 1 ) (set! s 2))",
    output: null,
  },
];

module.exports = {
  tests,
};

// for (i of tests) {
//   let str = "";
//   str += "input is : ";
//   str += i["input"];
//   str += " expected ouput : ";
//   str += i["output"];
//   str += "\n";
//   str += " output is : ";
//   str += parser(i["input"], env)[0];
//   str += "\n";
//   //   console.log(`input is :${i["input"]}`);
//   //   let testr = parser(i["input"], env);
//   //   console.log(`output is ${testr}`);
//   console.log(str);
// }
