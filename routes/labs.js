const User = require("../models/User");
const Lab = require("../models/Lab");
const Container = require("../models/Container");
const jwt = require("jsonwebtoken");
const adminRequired = require("../modules/apiAccess").adminRequired;
const userRequired = require("../modules/apiAccess").userRequired;
const getPathToLab = require("../modules/mongoTree").getPathToLab;
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
    Lab.findOneAndDelete(req.params.recordId).exec(error => {
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
  router.post("/labs/:recordId/membership", (req, res) => {
    Lab.findOne({ _id: req.params.recordId })
    .exec((err, record) => {
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

  // show one record
  router.get("/labs/:recordId", getRecordById, (req, res) => {
    let jsonResponse = {
      message: res.locals.message,
      data: res.locals.data,
      children: res.locals.children
    };
    res.json(jsonResponse);
  });

  // list all records
  router.get("/labs", getAllRecords, (req, res) => {
    let jsonResponse = {
      message: res.locals.message,
      data: res.locals.data
    };
    res.json(jsonResponse);
  });
};

function getAllRecords(req, res, next) {
  if (process.env.NODE_ENV === 'test') {
    Lab.find({}, {}, { sort: { name: 1 } })
    .exec((error, data) => {
      if (error) {
        res.locals.message = "There was a problem with retrieving the records.";
        res.locals.data = [];
      } else {
        res.locals.message = "The records were successfully retrieved.";
        res.locals.data = data;
      }
      return next();
    });
  } else {
    Lab.find({}, {}, { sort: { name: 1 } })
    .populate("users")
    .populate("joinRequests")
    .exec((error, data) => {
      if (error) {
        res.locals.message = "There was a problem with retrieving the records.";
        res.locals.data = [];
      } else {
        res.locals.message = "The records were successfully retrieved.";
        res.locals.data = data;
      }
      return next();
    });    
  }  
}

function getRecordById(req, res, next) {
  if (process.env.NODE_ENV === 'test') {
    Lab
    .findOne({'_id': req.params.recordId})
    .exec((error, data) => {
      if(error) {
        res.locals.message = "There was a problem with retrieving the record foo.";
        res.locals.error = error;
        res.locals.data = {};
        return next();
      } else {
        Container
        .find({'lab': req.params.recordId})
        .exec((error, children) => {
          if(error) {
            res.locals.message = "There was a problem with retrieving the children records.";
            res.locals.data = {};
            res.locals.children = [];
          } else {				
            res.locals.message = "The record was successfully retrieved.";
            res.locals.data = data;
            res.locals.children = children;
          }
          return next();
        });		
      }
    });
  } else {
    Lab
    .findOne({'_id': req.params.recordId})
    .populate("users")
    .populate("joinRequests")
    .exec((error, data) => {
      if(error) {
        res.locals.message = "There was a problem with retrieving the record foo.";
        res.locals.error = error;
        res.locals.data = {};
        return next();
      } else {
        Container
        .find({
          'lab': req.params.recordId
        })
        .populate('creator')
        .populate('lab')
        .populate('parent')
        .exec((error, children) => {
          if(error) {
            res.locals.message = "There was a problem with retrieving the children records.";
            res.locals.data = {};
            res.locals.children = [];
          } else {				
            res.locals.message = "The record was successfully retrieved.";
            res.locals.data = data;
            res.locals.children = children;
          }
          return next();
        });		
      }
    });
  }
}
