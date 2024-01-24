const { formatter } = require("./lispRepl");
const { testCases } = require("./lispTests");
const { temp } = require("./lispTempTest");
const { Env } = require("./lispClean");
const env = new Env();

// formatter(env);
testCases(env);
// temp(env);
