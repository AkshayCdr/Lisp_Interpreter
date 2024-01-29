const { main, Env } = require("./lispClean");
const { tests } = require("./tests");

// const env = new Env();

// function testCases(env) {
//   tests.forEach((element) => {
//     let str = "";
//     str += " input is : ";
//     str += element["input"];
//     str += "\n";
//     str += " expected ouput : ";
//     const expectedOutput = element["output"];
//     str += expectedOutput;
//     str += "\n";
//     str += " output is : ";
//     const result = main(element["input"], env);
//     // result !== null ? (str += result) : (str += "null");
//     result !== null
//       ? typeof result[0] === "function"
//         ? (str += "function")
//         : (str += result)
//       : (str += "null");
//     str += "\n";
//     // str += " status : ";
//     // str += typeof expectedOutput + typeof result;
//     // expectedOutput == result ? (str += "Passed") : (str += "failed");
//     console.log(str);
//     console.log("\n");
//   });
// }

function testCases(env) {
  tests.forEach((element) => {
    // let str = "";
    // str += " expected ouput : ";
    // const expectedOutput = element["output"];
    // str += expectedOutput;
    // str += "\n";
    // str += " type of expected output :";
    // str += typeof expectedOutput;
    // str += "\n";
    // str += " output is : ";
    // const result = main(element["input"], env);
    // // result !== null ? (str += result) : (str += "null");
    // result !== null
    //   ? typeof result[0] === "function"
    //     ? (str += "function")
    //     : (str += result)
    //   : (str += "null");
    // str += "\n";
    // str += "type of output :";
    // result !== null ? (str += typeof result) : (str += "no type");
    // str += "\n";
    // // str += " status : ";
    // // str += typeof expectedOutput + typeof result;
    // // expectedOutput == result ? (str += "Passed") : (str += "failed");
    // console.log(str);
    // console.log("\n");
    console.log("input");
    console.log(element["input"]);
    console.log("expected output ");
    console.log(element["output"]);
    console.log("output");
    let result = main(element["input"], env);
    console.log(result);
    // console.log(element["output"] == result);

    // result !== null
    //   ? console.log(
    //       JSON.stringify(element["output"]) == JSON.stringify(result[0])
    //     )
    //   : console.log(true);
    // console.log("\n");

    result !== null
      ? console.log(
          JSON.stringify(element["output"]) == JSON.stringify(result[0])
        )
      : console.log(true);
    console.log("\n");
  });
}

// testCases(env);

module.exports = {
  testCases,
};
