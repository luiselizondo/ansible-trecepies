var config = {};

switch(process.env.NODE_ENV) {
  case "dev":
    config = require("./dev.js");
    break;
  case "test":
    config = require("./test.js");
    break;
  case "production":
    config = require("./production.js");
    break;
  default:
    config = require("./dev.js");
    break;
}



module.exports = config;
