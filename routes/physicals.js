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
      createdBy: req.body.createdBy,
      updatedBy: req.body.createdBy,
      virtual: req.body.virtual,
      lab: req.body.lab,
      parent: req.body.parent,
      name: req.body.name,
      description: req.body.description,
      parent: req.body['parent'],
      row: req.body.row,
      column: req.body.column,
      rowSpan: req.body.rowSpan,
      columnSpan: req.body.columnSpan
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
      } else {
        jsonResponse = {
          success: true,
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
  router.post("/physicals/:recordId/edit", userRequired, (req, res) => {
    Physical.findOne({ _id: req.params.recordId })
    .exec((err, record) => {
      record.updatedAt = new Date();
      record.updatedBy = req.body.updatedBy;
      record.virtual = req.body.virtual || record.virtual;
      record.name = req.body.name || record.name;
      record.lab = req.body.lab || record.lab;
      record.parent = req.body.parent || record.parent;
      record.description = req.body.description || record.description;
      record.row = req.body.row || record.row;
      record.column = req.body.column || record.column;
      record.rowSpan = req.body.rowSpan || record.rowSpan;
      record.columnSpan = req.body.columnSpan || record.columnSpan;
  
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

  // show one record
  router.get("/physicals/:recordId", (req, res) => {
    const query = process.env.NODE_ENV === 'test' ? (
      Physical.findOne({_id: req.params.recordId}) 
    ) : ( 
      Physical
      .findOne({_id: req.params.recordId})
      .populate({
        path: 'parent',
        select: '_id name'
      })
      .populate({
        path: 'createdBy',
        select: '_id username'
      })
      .populate({
        path: 'updatedBy',
        select: '_id username'
      })
      .populate({
        path: 'lab',
        select: '_id name'
      })
      .populate('virtual')
    );

    query.exec((error, result) => {
      if (error) {
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
      } else {
        let jsonResponse = {
          success: true,
          message: "Success",
          error: {},
          data: result
        };
        res.json(jsonResponse);
      }
    });
  });

  // list all records
  router.get("/physicals", (req, res) => {
    fetchAll(Physical)
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
