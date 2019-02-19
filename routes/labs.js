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

if (!process.env.JWT_SECRET) {
  require("../config/env.js");
}

module.exports = function(router) {
  
  router.post("/labs/new", userRequired, (req, res) => {
    let newRecord = new Lab({
      createdBy: req.body.createdBy,
      updatedBy: req.body.createdBy,
      name: req.body.name,
      description: req.body.description,
      columns: req.body.columns,
      rows: req.body.rows,
      users: [`${req.body.createdBy}`],
      joinRequests: []
    });
    newRecord.save((error, data) => {
      let jsonResponse;
      if (error) {
        jsonResponse = {
          success: false,
          message: "There was a problem saving the new record.",
          data: {},
          error
        };
        res.status(401).json(jsonResponse);
      } else {
        jsonResponse = {
          success: true,
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
          success: false,
          message: "There was a problem removing the record."
        };
      } else {
        jsonResponse = {
          success: true,
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
      const currentUserExists = res.locals.currentUser && res.locals.currentUser._id;
      record.name = req.body.name;
      record.description = req.body.description;
      record.rows = req.body.rows;
      record.columns = req.body.columns;
      record.users = req.body.users || record.users;
      record.joinRequests = req.body.joinRequests || record.joinRequests;
      record.updatedAt = new Date();
      record.updatedBy = req.body.updatedBy;
      record.save((error, updatedRecord) => {
        let jsonResponse;
        if (error) {
          jsonResponse = {
            success: false,
            message: "There was a problem saving the updated record.",
            data: record
          };
        } else {
          jsonResponse = {
            success: true,
            message: "The updated record was successfully saved.",
            data: updatedRecord
          };
        }
        res.json(jsonResponse);
      });
    });     
  });

  // edit membership
  router.post("/labs/:recordId/membership", userRequired, (req, res) => {
    Lab.findOne({ _id: req.params.recordId })
    .exec((err, record) => {
      record.users = req.body.users || record.users;
      record.joinRequests = req.body.joinRequests || record.joinRequests;
      record.updatedAt = new Date();
      record.updatedBy = res.locals.currentUser._id;
      record.save((error, updatedRecord) => {
        let jsonResponse;
        if (error) {
          jsonResponse = {
            success: false,
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
              success: true,
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
  router.get("/labs/:recordId", (req, res) => {
    fetchOne(Lab, req.params.recordId)
    .then((result) => {
      let jsonResponse = {
        success: true,
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
        success: false,
        message,
        error,
        data: {}
      };
      res.json(jsonResponse);
    });
  });

  // list all records
  router.get("/labs", (req, res) => {
    fetchAll(Lab)
    .then((result) => {
      let jsonResponse = {
        success: true,
        message: "Success",
        error: {},
        data: result
      };
      res.json(jsonResponse);
    })
    .catch((error) => {
      let jsonResponse = {
        success: false,
        message: "There was an error",
        error,
        data: []
      };
      res.json(jsonResponse);      
    });
  });


};