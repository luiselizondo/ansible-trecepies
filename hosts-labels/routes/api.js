var express = require('express');
var router = express.Router();
var hosts = require("../services/hosts.js");

/* GET users listing. */
router.get('/hosts', function(req, res, next) {
  hosts.getAll(function(err, results) {
    if(err) {
      return res.status(406).json({error: err});
    }

    return res.status(200).json(results);
  });
});

router.get("/hosts/:id", function(req, res, next) {
  var id = req.params.id;

  hosts.get(id, function(err, results) {
    if(err) {
      return res.status(406).json({error: err});
    }

    return res.status(200).json(results);
  });
});

router.post("/hosts", function(req, res, next) {
  var body = req.body;

  hosts.save(body, function(err, results) {
    if(err) {
      return res.status(406).json({error: err});
    }

    return res.status(201).json(results);
  });
});

router.get("/labels/:label", function(req, res, next) {
  var label = req.params.label;
  hosts.getWithLabel(label, function(err, results) {
    if(err) {
      return res.status(406).json({error: err});
    }

    return res.status(201).json(results);
  })
});

router.delete("/hosts/:id", function(req, res, next) {
  var id = req.params.id;
  hosts.remove(id, function(err, results) {
    if(err) {
      return res.status(406).json({error: err});
    }

    return res.status(200).json(results);
  });
});

module.exports = router;
