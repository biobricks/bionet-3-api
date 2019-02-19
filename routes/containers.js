const User = require("../models/User");
const Physical = require("../models/Physical");
const Container = require("../models/Container");
const jwt = require("jsonwebtoken");
const adminRequired = require("../modules/apiAccess").adminRequired;
const userRequired = require("../modules/apiAccess").userRequired;
const fetchAll = require("../modules/fetch").fetchAll;
const fetchOne = require("../modules/fetch").fetchOne;

require("../config/env.js");


module.exports = function(router) {
  // create new record
  router.post("/containers/new", userRequired, (req, res) => {
    let newRecord = new Container({
      createdBy: req.body.createdBy,
      updatedBy: req.body.createdBy,
      parent: req.body.parent,
      lab: req.body.lab,
      name: req.body.name,
      description: req.body.description,
      rows: req.body.rows,
      columns: req.body.columns,
      row: req.body.row,
      column: req.body.column,
      rowSpan: req.body.rowSpan,
      columnSpan: req.body.columnSpan,
      category: req.body.category,
      bgColor: req.body.bgColor
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
        res.status(200).json(jsonResponse);
      }
    });
  });

  // remove record
  router.post("/containers/:recordId/remove", userRequired, (req, res) => {
    Container.findOneAndDelete({_id: req.params.recordId}).exec(error => {
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
  router.post("/containers/:recordId/edit", userRequired, (req, res) => {
    Container.findOne({ _id: req.params.recordId })
      .exec((err, record) => {
        if (err) { console.log(err); }
        record.updatedAt = new Date();
        record.updatedBy = req.body.updatedBy;
        record.name = req.body.name;
        record.lab = req.body.lab;
        record.parent = req.body.parent;
        record.description = req.body.description;
        record.rows = req.body.rows;
        record.columns  = req.body.columns;
        record.row = req.body.row;
        record.column = req.body.column;
        record.rowSpan = req.body.rowSpan;
        record.columnSpan = req.body.columnSpan;
        record.category = req.body.category;
        record.bgColor = req.body.bgColor;
    
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
  router.get("/containers/:recordId", (req, res) => {
    const query = process.env.NODE_ENV === 'test' ? (
      Container.findOne({_id: req.params.recordId}) 
    ) : ( 
      Container
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
        path: 'lab',
        select: '_id name'
      })
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

  // list all containers
  router.get("/containers", (req, res) => {
    fetchAll(Container)
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