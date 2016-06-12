var storage = require("node-persist");
var config = require("../config");
var _ = require("lodash");
var loop = require("node-loop");

function init() {
  storage.initSync({
  	dir: config.persistence.directory,
  	stringify: JSON.stringify,
  	parse: JSON.parse,
  	encoding: 'utf8',
  	logging: false,  // can also be custom logging function
  	continuous: true,
  	interval: false,
  	ttl: false // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS
  });

  return storage;
}

var hosts = {};

hosts.save = function(host, callback) {
  var storage = init();

  if(_.isArray(host)) {
    return saveManyHosts(storage, host, callback);
  }
  else {
    return saveOneHost(storage, host, callback);
  }
}

function saveOneHost(storage, host, callback) {
  var errors = validate(host);

  if(errors) {
    return callback(errors);
  }

  var id = constructId(host);
  storage.setItem(id, host, function(err, result) {
    var res = null;
    if(result[0]) {
      res = result[0];
      res.data = JSON.parse(result[0].data);
      delete res.file;
    }

    return callback(err, res);
  });
}

function validate(host) {
  var errors = false;

  if(!host.cloud) {
    return "The cloud property is required";
  }

  if(!host.id) {
    return "The id property is required";
  }

  if(!host.ip4) {
    return "The ip4 property is required";
  }

  if(!host.name) {
    return "The name property is required";
  }

  if(!host.labels || host.labels.length === 0) {
    return "The labels property is required";
  }

  return errors;
}

function constructId(host) {
  return host.cloud + ":" + host.id;
}

function saveManyHosts(storage, hosts, callback) {
  loop.async(hosts, function(host, next) {
    return saveOneHost(storage, host, next);
  }, function(err, results) {
    return callback(err, results);
  });
}

hosts.getAll = function(callback) {
  var storage = init();
  var values = storage.values();

  return callback(null, values);
}

hosts.get = function(id, callback) {
  var storage = init();
  storage.getItem(id, function(err, values) {
    var result = null;
    if(values) {
      result = {
        key: id,
        data: values
      }
    }

    return callback(err, result);
  })
}

hosts.getWithLabel = function(label, callback) {
  var storage = init();
  var values = storage.values();

  var hostsWithLabel = [];
  _.forEach(values, function(value) {
    if(_.includes(value.labels, label)) {
      var hostObject = {
        key: value.cloud + ":" + value.id,
        data: value
      }

      hostsWithLabel.push(hostObject);
    }
  });

  return callback(null, hostsWithLabel);
}

module.exports = hosts;
