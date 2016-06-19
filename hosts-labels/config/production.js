var config = {};
var path = require("path");

var directory = path.join(__dirname, "../persistence/production");
config.persistence = {
  directory: directory
}

module.exports = config;
