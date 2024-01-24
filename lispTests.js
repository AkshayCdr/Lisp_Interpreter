const { main, Env } = require("./lispClean");
const { tests } = require("./tests");

// const env = new Env();

function testCases(env) {
  tests.forEach((element) => {
    let str = "";
    str += " input is : ";
    str += element["input"];
    str += "\n";
    str += " expected ouput : ";
    const expectedOutput = element["output"];
    str += expectedOutput;
    str += "\n";
    str += " output is : ";
    const result = main(element["input"], env);
    // result !== null ? (str += result) : (str += "null");
    result !== null
      ? typeof result[0] === "function"
        ? (str += "function")
        : (str += result)
      : (str += "null");

    console.log("\n");
    console.log(str);
  });
}

// testCases(env);

module.exports = {
  testCases,
};
