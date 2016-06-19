var express = require('express');
var router = express.Router();
var hosts = require("../services/hosts.js");
var _ = require("lodash");

/* GET users listing. */
router.get('/hosts', function(req, res, next) {
  hosts.getAll(function(err, results) {
    if(err) {
      return res.status(406).json({error: err});
    }

    if(req.accepts('application/json')) {
      return res.status(200).json(results);
    }
    else if(req.accepts("text/plain")) {
      res.setHeader("Content-Type", "text/plain");
      var text = "";
      _.each(results, function(result) {
        text = "Host " + result.name + "\n" +
        "Name: " + result.name + "\n" +
        "Cloud: " + result.cloud + "\n" +
        "IPv4: " + result.ip4 + "\n" +
        "ID: " + result.id + "\n" +
        "Labels: " + result.labels.join(", ") + "\n" +
        "---";
      });
      return res.status(200).send(text);
    }
    else {
      return res.status(200).json(results);
    }
  });
});

router.get("/hosts/:id", function(req, res, next) {
  var id = req.params.id;

  hosts.get(id, function(err, result) {
    if(err) {
      return res.status(406).json({error: err});
    }

    if(req.accepts("application/json")) {
      return res.status(200).json(result);
    }
    else if(req.accepts("text/plain")) {
      res.setHeader("Content-Type", "text/plain");
      var text = "";
      text = "Host " + result.data.name + "\n" +
      "ID:" + result.key + "\n" +
      "Name: " + result.data.name + "\n" +
      "Cloud: " + result.data.cloud + "\n" +
      "IPv4: " + result.data.ip4 + "\n" +
      "Host Id: " + result.data.id + "\n" +
      "Labels: " + result.data.labels.join(", ") + "\n" +
      "---";

      return res.status(200).send(text);
    }
    else {
      return res.status(200).json(result);
    }
  });
});

router.get("/ip4/:ip", function(req, res, next) {
  var ip = req.params.ip;

  hosts.getByIP(ip, function(err, result) {
    if(err) {
      return res.status(406).json({error: err});
    }

    if(req.accepts("application/json")) {
      return res.status(200).json(result);
    }
    else if(req.accepts("text/plain")) {
      res.setHeader("Content-Type", "text/plain");
      var text = "";
      text = "Host " + result.data.name + "\n" +
      "ID:" + result.key + "\n" +
      "Name: " + result.data.name + "\n" +
      "Cloud: " + result.data.cloud + "\n" +
      "IPv4: " + result.data.ip4 + "\n" +
      "Host Id: " + result.data.id + "\n" +
      "Labels: " + result.data.labels.join(", ") + "\n" +
      "---";

      return res.status(200).send(text);
    }
    else {
      return res.status(200).json(result);
    }
  });
});

router.post("/hosts", function(req, res, next) {
  var body = req.body;

  console.log(body);
  hosts.save(body, function(err, result) {
    if(err) {
      return res.status(406).json({error: err});
    }

    switch(req.accepts) {
      case "application/json":
        return res.status(200).json(result);
      break;

      // TODO Incomplete, we need to know if the result is an array or an object
      // case "text/plain":
      //   res.setHeader("Content-Type", "text/plain");
      //   var text = "";
      //   text = "Host created with key: " + result.key;
      //
      //   return res.status(200).send(text);
      // break;

      default:
        return res.status(200).json(result);
      break;
    }
  });
});

router.get("/labels/:label", function(req, res, next) {
  var label = req.params.label;
  hosts.getWithLabel(label, function(err, results) {
    if(err) {
      return res.status(406).json({error: err});
    }

    if(req.accepts('application/json')) {
      return res.status(200).json(results);
    }
    else if(req.accepts("text/plain")) {
      res.setHeader("Content-Type", "text/plain");

      var text = "";
      if(req.query.only_return_ips) {
        _.each(results, function(result, key) {
          if(key+1 == results.length) {
            text = text + result.data.ip4;
          }
          else {
            text = text + result.data.ip4 + " ";
          }
        });
      }
      else {
        _.each(results, function(result) {
          text = "Host " + result.data.name + "\n" +
          "ID: " + result.key + "\n" +
          "Name: " + result.data.name + "\n" +
          "Cloud: " + result.data.cloud + "\n" +
          "IPv4: " + result.data.ip4 + "\n" +
          "Host id: " + result.data.id + "\n" +
          "Labels: " + result.data.labels.join(", ") + "\n" +
          "---";
        });
      }


      return res.status(200).send(text);
    }
    else {
      return res.status(200).json(results);
    }
  })
});

router.delete("/hosts/:id", function(req, res, next) {
  var id = req.params.id;
  hosts.remove(id, function(err, result) {
    if(err) {
      return res.status(406).json({error: err});
    }

    if(req.accepts("application/json")) {
      return res.status(200).json(result);
    }
    else if(req.accepts("text/plain")) {
      res.setHeader("Content-Type", "text/plain");
      var text = "Host removed with key: " + result.key;

      return res.status(200).send(text);
    }
    else {
      return res.status(200).json(result);
    }
  });
});

module.exports = router;
