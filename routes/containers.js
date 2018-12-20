const User = require("../models/User");
const Physical = require("../models/Physical");
const Container = require("../models/Container");
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
  router.post("/containers/new", userRequired, (req, res) => {
    let newRecord = new Container({
      creator: req.body.creator,
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
      datName: req.body.datName,
      datHash: req.body.datHash,
      bgColor: req.body.bgColor
    });
    newRecord.save((error, data) => {
      let jsonResponse;
      if (error) {
        jsonResponse = {
          message: "There was a problem saving the new record.",
          data: {},
          error
        };
        res.status(401).json(jsonResponse);
      } else {
        jsonResponse = {
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
  router.post("/containers/:recordId/edit", userRequired, (req, res) => {
    if (process.env.NODE_ENV === 'test') {
      Container.findOne({ _id: req.params.recordId })
        .exec((err, record) => {
          if (err) { console.log(err); }
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
          record.datName = req.body.datName;
          record.datHash = req.body.datHash;
          record.bgColor = req.body.bgColor;
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
      Container.findOne({ _id: req.params.recordId })
        .populate("parent")
        .exec((err, record) => {
          record.name = req.body.name;
          record.parent = req.body.parent;
          record.description = req.body.description;
          record.rows = req.body.rows;
          record.columns = req.body.columns;
          record.row = req.body.row;
          record.column = req.body.column;
          record.rowSpan = req.body.rowSpan;
          record.columnSpan = req.body.columnSpan;
          record.category = req.body.category;
          record.datName = req.body.datName;
          record.datHash = req.body.datHash;
          record.bgColor = req.body.bgColor;
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
  // ex. http://localhost:3001/api/v1/containers/5bea189dbaed03330b2c2145
  router.get("/containers/:recordId", (req, res) => {
    fetchOne(Container, req.params.recordId)
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

  // list all containers
  // ex. http://localhost:3001/api/v1/containers
  router.get("/containers", (req, res) => {
    fetchAll(Container)
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