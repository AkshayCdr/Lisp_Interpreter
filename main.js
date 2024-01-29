const { formatter } = require("./lispRepl");
const { testCases } = require("./lispTests");
const { temp } = require("./lispTempTest");
const { globalEnv } = require("./lispClean");
// const env = new Env();

// formatter(globalEnv);
testCases(globalEnv);
// temp(globalEnv);
