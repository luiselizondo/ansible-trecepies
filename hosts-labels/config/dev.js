var config = {};
var path = require("path");

var directory = path.join(__dirname, "../persistence/dev");
config.persistence = {
  directory: directory
}

module.exports = config;
