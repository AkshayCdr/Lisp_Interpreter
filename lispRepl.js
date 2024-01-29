const { main } = require("./lispClean");
const { globalEnv } = require("./lispClean");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function formatter(env) {
  return readline.question("lisp>>", (string) => {
    try {
      const result = main(string, env);
      for (const output of result) {
        console.log(output);
      }
      // console.log(main(string, env)[0]);
    } catch (error) {
      console.log("Syntax Error ");
    }
    if (string === "exit") {
      readline.close();
    } else {
      formatter(env);
    }
  });
}

// formatter(globalEnv);

module.exports = {
  formatter,
};
