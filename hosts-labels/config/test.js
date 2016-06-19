var config = {};
var path = require("path");

var directory = path.join(__dirname, "../persistence/test");
config.persistence = {
  directory: directory
}
module.exports = config;
