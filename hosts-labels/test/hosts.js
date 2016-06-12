var should = require("should");
var config = require("../config");
var fs = require("fs");
var hosts = require("../services/hosts.js");

function removePersistenceFiles(callback) {
  fs.access(config.persistence.directory, fs.R_OK, function(err) {
    if(err) return callback();

    fs.unlink(config.persistence.directory, function(error) {
      if(error) throw new Error(error);
      return callback();
    })
  })

}

describe("Hosts persistence", function() {

  afterEach(function(done) {
    removePersistenceFiles(done);
  });

  describe("Validation", function() {
    it("Should return an error if the cloud is not set", function(done) {
      var host = {
        // cloud: "digitalocean",
        id: "17269744",
        ip4: "127.0.0.1",
        name: "ubuntu-1",
        labels: [
          "web", "docker"
        ]
      }

      hosts.save(host, function(err, result) {
        should.not.exist(result);
        err.should.be.equal("The cloud property is required");
        done();
      })
    });

    it("Should return an error if the id is not set", function(done) {
      var host = {
        cloud: "digitalocean",
        ip4: "127.0.0.1",
        name: "ubuntu-1",
        labels: [
          "web", "docker"
        ]
      }

      hosts.save(host, function(err, result) {
        should.not.exist(result);
        err.should.be.equal("The id property is required");
        done();
      })
    });

    it("Should return an error if the ip is not set", function(done) {
      var host = {
        cloud: "digitalocean",
        id: "17269744",
        name: "ubuntu-1",
        labels: [
          "web", "docker"
        ]
      }

      hosts.save(host, function(err, result) {
        should.not.exist(result);
        err.should.be.equal("The ip4 property is required");
        done();
      })
    });

    it("Should return an error if the name is not set", function(done) {
      var host = {
        cloud: "digitalocean",
        id: "17269744",
        ip4: "127.0.0.1",
        labels: [
          "web", "docker"
        ]
      }

      hosts.save(host, function(err, result) {
        should.not.exist(result);
        err.should.be.equal("The name property is required");
        done();
      })
    });

    it("Should return an error if the labels are not set", function(done) {
      var host = {
        cloud: "digitalocean",
        id: "17269744",
        name: "ubuntu-1",
        ip4: "127.0.0.1",
      }

      hosts.save(host, function(err, result) {
        should.not.exist(result);
        err.should.be.equal("The labels property is required");
        done();
      })
    });

    it("Should return an error if the labels are zero", function(done) {
      var host = {
        cloud: "digitalocean",
        id: "17269744",
        name: "ubuntu-1",
        ip4: "127.0.0.1",
        labels: []
      }

      hosts.save(host, function(err, result) {
        should.not.exist(result);
        err.should.be.equal("The labels property is required");
        done();
      })
    });
  });

  describe("Save", function() {
    it("Should save a host into a persistence file", function(done) {
      var host = {
        cloud: "digitalocean",
        id: "17269744",
        ip4: "127.0.0.1",
        name: "ubuntu-1",
        labels: [
          "web", "docker"
        ]
      }

      hosts.save(host, function(err, result) {
        should.not.exist(err);
        result.should.have.property("key", host.cloud + ":" + host.id);

        result.data.should.have.property("cloud", host.cloud);
        result.data.should.have.property("id", host.id);
        result.data.should.have.property("ip4", host.ip4);
        result.data.should.have.property("name", host.name);
        result.data.should.have.property("labels").with.lengthOf(2);

        done();
      });
    });

    it("Should save an array of hosts into a persistence file", function(done) {
      var hostsValues = [
        {
          cloud: "digitalocean",
          id: "17269744",
          ip4: "127.0.0.1",
          name: "ubuntu-1",
          labels: [
            "web", "docker"
          ]
        },
        {
          cloud: "digitalocean",
          id: "17269745",
          ip4: "127.0.0.1",
          name: "ubuntu-2",
          labels: [
            "web", "docker"
          ]
        }
      ];

      hosts.save(hostsValues, function(err, result) {
        should.not.exist(err);

        // there is no way to guarantee the order of the keys
        var key0 = hostsValues[0].cloud + ":" + hostsValues[0].id;
        var key1 = hostsValues[1].cloud + ":" + hostsValues[1].id;
        var keyUsed;

        if(result[0].key == key0) {
          keyUsed = 0;
        }
        else {
          keyUsed = 1;
        }

        result[0].should.have.property("key", hostsValues[keyUsed].cloud + ":" + hostsValues[keyUsed].id);

        result[0].data.should.have.property("cloud", hostsValues[keyUsed].cloud);
        result[0].data.should.have.property("id", hostsValues[keyUsed].id);
        result[0].data.should.have.property("ip4", hostsValues[keyUsed].ip4);
        result[0].data.should.have.property("name", hostsValues[keyUsed].name);
        result[0].data.should.have.property("labels").with.lengthOf(2);

        result.should.be.an.Array;

        done();
      });
    });
  });

  describe("Get", function() {
    it("Should retrieve a JSON array of hosts saved into a persistence file", function(done) {
      var host = {
        cloud: "digitalocean",
        id: "17269744",
        ip4: "127.0.0.1",
        name: "ubuntu-1",
        labels: [
          "web", "docker"
        ]
      }

      hosts.save(host, function(err, result) {
        hosts.getAll(function(err, results) {
          results.should.be.an.Array;
          done();
        });
      });
    });

    // it("Should retrieve a text string of IPs of hosts");
    it("Should retrieve one host", function(done) {
      var host = {
        cloud: "digitalocean",
        id: "17269744",
        ip4: "127.0.0.1",
        name: "ubuntu-1",
        labels: [
          "web", "docker"
        ]
      }

      hosts.save(host, function(err, result) {
        hosts.get(host.cloud + ":" + host.id, function(err, result) {
          result.should.be.an.Object;
          result.data.should.have.property("id", host.id);
          result.data.should.have.property("cloud", host.cloud);
          result.data.should.have.property("ip4", host.ip4);
          result.data.should.have.property("name", host.name);
          result.data.should.have.property("labels");
          done();
        });
      });
    });

    it("Should retrieve an array of hosts with one label", function(done) {
      var hostsValues = [
        {
          cloud: "digitalocean",
          id: "17269744",
          ip4: "127.0.0.1",
          name: "ubuntu-1",
          labels: [
            "web"
          ]
        },
        {
          cloud: "digitalocean",
          id: "17269745",
          ip4: "127.0.0.1",
          name: "ubuntu-2",
          labels: [
            "web", "docker"
          ]
        },
        {
          cloud: "digitalocean",
          id: "17269746",
          ip4: "127.0.0.1",
          name: "ubuntu-3",
          labels: [
            "docker"
          ]
        }
      ];

      hosts.save(hostsValues, function(err, result) {
        hosts.getWithLabel("docker", function(err, results) {
          results.should.be.an.Array;
          results.should.have.length(2);

          results[0].data.should.have.property("id", hostsValues[1].id);
          results[0].data.should.have.property("cloud", hostsValues[1].cloud);
          results[0].data.should.have.property("ip4", hostsValues[1].ip4);
          results[0].data.should.have.property("name", hostsValues[1].name);
          results[0].data.should.have.property("labels");

          done();
        });
      });
    });
  });

  describe("Delete", function() {
    it("Should delete an item", function(done) {
      var host = {
        cloud: "digitalocean",
        id: "17269744",
        ip4: "127.0.0.1",
        name: "ubuntu-1",
        labels: [
          "web", "docker"
        ]
      }

      hosts.save(host, function(err, result) {
        hosts.remove(host.cloud + ":" + host.id, function(err, result) {
          should.not.exist(err);
          result.should.be.an.Object;
          result.should.have.property("key", host.cloud + ":" + host.id);
          done();
        });
      });
    })
  });
});
