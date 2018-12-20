const User = require("../models/User");
const Lab = require("../models/Lab");
const Container = require("../models/Container");
const Physical = require("../models/Physical");
const jwt = require("jsonwebtoken");
const adminRequired = require("../modules/apiAccess").adminRequired;
const userRequired = require("../modules/apiAccess").userRequired;
const getPathToLab = require("../modules/mongoTree").getPathToLab;
const fetchAll = require("../modules/fetch").fetchAll;
const fetchOne = require("../modules/fetch").fetchOne;
const checkForDat = require("../modules/dat").checkForDat;

if (!process.env.JWT_SECRET) {
  require("../config/env.js");
}

module.exports = function(router) {
  
  // create new record
  router.post("/labs/new", userRequired, (req, res) => {
    let users = res.locals.currentUser ? [`${res.locals.currentUser._id}`] : [`${req.body.creator}`];
    let newRecord = new Lab({
      name: req.body.name,
      description: req.body.description,
      columns: req.body.columns,
      rows: req.body.rows,
      users,
      joinRequests: []
    });
    newRecord.save((error, data) => {
      let jsonResponse;
      if (error) {
        jsonResponse = {
          message: "There was a problem saving the new record.",
          data: {},
          error
        };
        res.json(jsonResponse);
      } else {
        jsonResponse = {
          message: "The new record was successfully saved.",
          data: data,
          error: {}
        };
        res.json(jsonResponse);
      }
      
    });
  });

  // show breadcrumbs path for container
  router.get("/labs/:recordId/container/:containerId", (req, res) => {

    getPathToLab(req.params.recordId, req.params.containerId, Container, (error, path) => {
      if (error) { console.log(error); }
      res.json(path);
    });

  });

  // remove record
  router.post("/labs/:recordId/remove", userRequired, (req, res) => {
    Lab.findOneAndDelete({_id: req.params.recordId}).exec(error => {
      if (error) {
        jsonResponse = {
          message: "There was a problem removing the record."
        };
      } else {
        jsonResponse = {
          message: "The record was successfully removed."
        };
      }
      res.json(jsonResponse);
    });
  });

  // edit record
  router.post("/labs/:recordId/edit", userRequired, (req, res) => {
    Lab.findOne({ _id: req.params.recordId })
    .exec((err, record) => {
      record.name = req.body.name;
      record.description = req.body.description;
      record.rows = req.body.rows;
      record.columns = req.body.columns;
      record.datName = req.body.datName || record.datName;
      record.datKey = req.body.datKey || record.datKey;
      record.users = req.body.users || record.users;
      record.joinRequests = req.body.joinRequests || record.joinRequests;
      record.updatedAt = new Date();
      record.save((error, updatedRecord) => {
        let jsonResponse;
        if (error) {
          jsonResponse = {
            message: "There was a problem saving the updated record.",
            data: record
          };
        } else {
          jsonResponse = {
            message: "The updated record was successfully saved.",
            data: updatedRecord
          };
        }
        res.json(jsonResponse);
      });
    });     
  });

  // edit record
  router.post("/labs/:recordId/membership", userRequired, (req, res) => {
    Lab.findOne({ _id: req.params.recordId })
    .exec((err, record) => {
      record.users = req.body.users;
      record.joinRequests = req.body.joinRequests;
      record.updatedAt = new Date();
      record.save((error, updatedRecord) => {
        let jsonResponse;
        if (error) {
          jsonResponse = {
            message: "There was a problem saving the updated record.",
            data: record
          };
          res.json(jsonResponse);
        } else {
          Lab.findOne({ _id: req.params.recordId })
          .populate("users")
          .populate("joinRequests")
          .exec((err, populatedRecord) => {
            jsonResponse = {
              message: "The updated record was successfully saved.",
              data: populatedRecord
            };
            res.json(jsonResponse);
          });  
        }
      });
    });     
  });

  // show one record
  // ex. http://localhost:3001/api/v1/labs/5be539538a1ad7177722787f
  router.get("/labs/:recordId", checkForDat, (req, res) => {
    // if no dat found with key of :recordId
    if (!res.locals.datFound) {
      fetchOne(Lab, req.params.recordId)
      .then((result) => {
        let jsonResponse = {
          message: "Success - data retrieved from Bionet Centralized Database",
          error: {},
          data: result
        };
        res.json(jsonResponse);
      })
      .catch((error) => {
        let message;
        if (error.name === 'CastError'){
          message = `Record with _id ${error.value} not found`;
        } else {
          message = "An error occurred."
        }
        let jsonResponse = {
          message,
          error,
          data: {}
        };
        res.json(jsonResponse);
      });
    // if dat was found with key of :recordId  
    } else {
      let message = "Success - data retrieved from Dat Peer To Peer Network";
      let jsonResponse = {
        message,
        error,
        data: res.locals.dat
      };
      res.json(jsonResponse);      
    }  
  });

  // list all records
  // ex. http://localhost:3001/api/v1/labs/
  router.get("/labs", (req, res) => {
    fetchAll(Lab)
    .then((result) => {
      let jsonResponse = {
        message: "Success",
        error: {},
        data: result
      };
      res.json(jsonResponse);
    })
    .catch((error) => {
      let jsonResponse = {
        message: "There was an error",
        error,
        data: []
      };
      res.json(jsonResponse);      
    });
  });


};
