const { main } = require("./lispClean");
const { Env } = require("./lispClean");
const env = new Env();

function temp(env) {
  //   let string1 = "(define circle-area (lambda (r) (* 3.14 (* r r))))";
  //   let string2 = "(circle-area 5)";
  //   let string3 =
  //     "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))";
  //   let string4 = "(fact 5)";
  //   let string5 = "(circle-area (fact 10))";

  //   let string = "(list(1 2 4 2 3))"; //show ()
  //   let string1 = "(+)";
  //   let string2 = "( + )"; //show 0
  //   let string3 = "((+ 5 1)"; //show error
  //   let string4 = "((if #t + *) (* 2 4) 5)";
  //   let string5 = "kai"; //show error
  //   let string6 = "(+ 7 2))"; //show answer and error
  //   //   let string7 = "((if (< 5 4) + -) (+ 45 3) (- 45 3))";
  //   let string7 = "((if (< 5 4) + -) (+ 45 3)) (- 45 3))"; //show answer and error
  //   let string9 = "(+ 4 5)(+ 7 6)";

  // let string1 = "(list (0 1 2 3 4))";
  //   let string1 = "((lambda (x) (+ x x)) 4)";
  //   let string1 = "(define reverse-subtract(lambda (x y) (- y x)))";
  //   let string2 = "(reverse-subtract 7 10)";

  //   let string1 = "(quote (a b c))";
  let string1 = "(define twice (lambda (x) (* 2 x)))";
  let string2 = "(twice 5)";
  let string3 = "(define repeat (lambda (f) (lambda (x) (f (f x)))))";
  let string4 = "((repeat twice) 10)";
  let string5 = "((repeat (repeat twice)) 10)";
  let string6 = " ((repeat (repeat (repeat twice))) 10)";
  let string7 = "(quote #(a b c))";
  let string9 = "(quote (a b)))";

  //   let string1 = "(define a 5)";
  //   let string2 = "(set! a 8)";

  //   let string1 = "(define define 10)";
  //   let string2 = "define";
  //   let string3 = "(define a 20)";
  //   let string4 = "a";
  //   let string5 = "(define if 60)";
  //   let string6 = "if";

  //   let string3 = "(define twice (lambda (x) (* 2 x)))";
  //   let string4 = "(twice 5)";

  //   let string3 = '(define a "(define h 5))")';
  //   let string4 = "a";

  //   let string1 = "(define list (1 2 3 4 5))";
  //   let string2 = "(cdr list)";

  //   let string1 = "(define lst (quote(1 2 3 4)))";
  //   let string2 = "(cdr lst)";
  //   let string1 = "(define define 10)";
  //   let string2 = "define";
  //   let result = parser(string, env);
  let result1 = main(string1, env);
  let result2 = main(string2, env);
  let result3 = main(string3, env);
  let result4 = main(string4, env);
  let result5 = main(string5, env);
  let result6 = main(string6, env);
  let result7 = main(string7, env);
  let result9 = main(string9, env);

  //   console.log(result);
  console.log(result1);
  console.log(result2);
  console.log(result3);
  console.log(result4);
  console.log(result5);
  console.log(result6);
  console.log(result7);
  console.log(result9);
}

// temp(env);

module.exports = {
  temp,
};
