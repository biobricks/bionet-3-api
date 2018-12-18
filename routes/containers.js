const User = require("../models/User");
const Physical = require("../models/Physical");
const Container = require("../models/Container");
const jwt = require("jsonwebtoken");
const adminRequired = require("../modules/apiAccess").adminRequired;
const userRequired = require("../modules/apiAccess").userRequired;

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
      category: req.body.category,
      datName: req.body.datName,
      datHash: req.body.datHash,
      bgColor: req.body.bgColor,

      row: req.body.row,
      column: req.body.column,
      rowSpan: req.body.rowSpan,
      colSpan: req.body.colSpan
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
          record.locations = req.body.locations;
          record.category = req.body.category;
          record.datName = req.body.datName;
          record.datHash = req.body.datHash;
          record.bgColor = req.body.bgColor;

          record.row = req.body.row;
          record.row = req.body.row;
          record.row = req.body.row;
          record.row = req.body.row;

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
          record.locations = req.body.locations;
          record.category = req.body.category;
          record.datName = req.body.datName;
          record.datHash = req.body.datHash;
          record.bgColor = req.body.bgColor;

          record.row = req.body.row;
          record.row = req.body.row;
          record.row = req.body.row;
          record.row = req.body.row;

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
  router.get("/containers/:recordId", getRecordById, (req, res) => {
    let jsonResponse = {
      message: res.locals.message,
      data: res.locals.data,
      containers: res.locals.containers,
      physicals: res.locals.physicals
    };
    res.json(jsonResponse);
  });

  // list all records
  router.get("/containers", getAllRecords, (req, res) => {
    let jsonResponse = {
      message: res.locals.message,
      data: res.locals.data
    };
    res.json(jsonResponse);
  });
};

function getAllRecords(req, res, next) {
  if (process.env.NODE_ENV === 'test') {
    Container.find({}, {}, { sort: { name: 1 } })
    .exec((error, data) => {
      if (error) {
        res.locals.message =
          "There was a problem with retrieving the records.";
      } else {
        res.locals.message =
          "The records were successfully retrieved.";
      }
      res.locals.data = data;
      return next();
    });
  } else {
    Container.find({}, {}, { sort: { name: 1 } })
    .populate("creator")
    .populate("lab")
    .populate("parent")
    .exec((error, data) => {
      if (error) {
        res.locals.message =
          "There was a problem with retrieving the records.";
      } else {
        res.locals.message =
          "The records were successfully retrieved.";
      }
      res.locals.data = data;
      return next();
    });    
  }  
}

function getRecordById(req, res, next) {
  if (process.env.NODE_ENV === 'test') {
    Container
    .findOne({'_id': req.params.recordId})
    .exec((error, data) => {
      if(error) {
        res.locals.message = "There was a problem with retrieving the record.";
        res.locals.data = {};
        res.locals.containers = [];
      } else {
        res.locals.message = "The record was successfully retrieved.";
        res.locals.data = data; 
        res.locals.containers = [];              
      }
      return next();
    });
  } else {
    Container
    .findOne({'_id': req.params.recordId})
    .populate("creator")
    .populate("lab")
    .populate("parent")
    .exec((error, container) => {
      if(error) {
        res.locals.message = "There was a problem with retrieving the record.";
        res.locals.data = {};
        res.locals.containers = [];
        return next();
      } else {
        Container
        .find({'parent': container._id}, {}, { sort: { name: 1 }})
        .populate("creator")
        .populate("lab")
        .exec((error, containers) => {
          if(error) {
            res.locals.message = "There was a problem with retrieving the record.";
            res.locals.data = {};
            res.locals.containers = [];
            return next();
          } else {
            Physical
            .find({'parent': container._id}, {}, { sort: { name: 1 }})
            .populate("creator")
            .populate("virtual")
            .populate("lab")
            .exec((error, physicals) => {
              if(error) {
                res.locals.message = "There was a problem with retrieving the record.";
                res.locals.data = {};
                res.locals.containers = [];
                res.locals.physicals = [];
              } else {
                res.locals.message = "The record was successfully retrieved.";
                res.locals.data = container;
                res.locals.containers = containers;
                res.locals.physicals = physicals;
              }
              return next();
            });            
          }
        });             
      }
    });
  }
}   
