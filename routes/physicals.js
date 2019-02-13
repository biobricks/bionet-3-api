const User = require("../models/User");
const Virtual = require("../models/Virtual");
const Container = require("../models/Container");
const Physical = require("../models/Physical");
const jwt = require("jsonwebtoken");
const adminRequired = require("../modules/apiAccess").adminRequired;
const userRequired = require("../modules/apiAccess").userRequired;
const fetchAll = require("../modules/fetch").fetchAll;
const fetchOne = require("../modules/fetch").fetchOne;

if (!process.env.JWT_SECRET) {
  require("../config/env.js");
}

module.exports = function(router) {
  // create new record
  router.post("/physicals/new", userRequired, (req, res) => {
    let newRecord = new Physical({
      virtual: req.body.virtual,
      creator: res.locals.currentUser || req.body.creator,
      lab: req.body.lab,
      parent: req.body.parent,
      name: req.body.name,
      description: req.body.description,
      parent: req.body['parent'],
      row: req.body.row,
      column: req.body.column
    });
    newRecord.save((error, data) => {
      let jsonResponse;
      if (error) {
        jsonResponse = {
          message: "There was a problem saving the new record.",
          data: {},
          error
        };
      } else {
        jsonResponse = {
          message: "The new record was successfully saved.",
          data: data,
          error: {}
        };
      }
      res.json(jsonResponse);
    });
  });

  // remove record
  router.post("/physicals/:recordId/remove", userRequired, (req, res) => {
    Physical.findOneAndDelete({_id: req.params.recordId}).exec(error => {
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
  router.post("/physicals/:recordId/edit", userRequired, (req, res) => {
    if (process.env.NODE_ENV === 'test') {
      Physical.findOne({ _id: req.params.recordId })
        .exec((err, record) => {
          record.virtual = req.body.virtual;
          record.creator = req.body.creator;
          record.name = req.body.name;
          record.lab = req.body.lab;
          record.parent = req.body.parent;
          record.description = req.body.description;
          record.row = req.body.row;
          record.column = req.body.column;
          record.rowSpan = req.body.rowSpan;
          record.columnSpan = req.body.columnSpan;
          record.datName = req.body.datName;
          record.datHash = req.body.datHash;
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
    } else {
      Physical.findOne({ _id: req.params.recordId })
        .populate("creator")
        .populate("virtual")
        .populate("lab")
        .populate("parent")
        .exec((err, record) => {
          record.virtual = req.body.virtual;
          record.creator = req.body.creator;
          record.name = req.body.name;
          record.lab = req.body.lab;
          record.parent = req.body.parent;
          record.description = req.body.description;
          record.locations = req.body.locations;
          record.datName = req.body.datName;
          record.datHash = req.body.datHash;
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
    }
  });

  // show one record
  router.get("/physicals/:recordId", (req, res) => {
    fetchOne(Physical, req.params.recordId)
    .then((result) => {
      let jsonResponse = {
        message: "Success",
        error: {},
        data: result
      };
      res.json(jsonResponse);
    })
    .catch((error) => {
      console.log(error);
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
  });

  // list all records
  router.get("/physicals", (req, res) => {
    fetchAll(Physical)
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
