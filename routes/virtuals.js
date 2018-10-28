const User = require("../models/User");
const Virtual = require("../models/Virtual");
const jwt = require("jsonwebtoken");
const adminRequired = require("../modules/apiAccess").adminRequired;

if (!process.env.JWT_SECRET) {
  require("../config/env.js");
}

module.exports = function(router) {
  // create new record
  router.post("/virtuals/new", (req, res) => {
    let newRecord = new Virtual({
      creator: res.locals.currentUser || req.body.creator,
      name: req.body.name,
      description: req.body.description,
      provenance: req.body.provenance,
      genotype: req.body.genotype,
      sequence: req.body.sequence,
      category: req.body.category,
      datName: req.body.datName,
      datHash: req.body.datHash
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
  router.post("/virtuals/:recordId/remove", adminRequired, (req, res) => {
    Virtual.findOneAndDelete(req.params.recordId).exec(error => {
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
  router.post("/virtuals/:recordId/edit", adminRequired, (req, res) => {
    if (process.env.NODE_ENV === 'test') {
      Virtual.findOne({ _id: req.params.recordId })
        .exec((err, record) => {
          record.creator = req.body.creator;
          record.name = req.body.name;
          record.description = req.body.description;
          record.provenance = req.body.provenance;
          record.genotype = req.body.genotype;
          record.sequence = req.body.sequence;
          record.category = req.body.category;
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
      Virtual.findOne({ _id: req.params.recordId })
        .exec((err, record) => {
          record.creator = req.body.creator;
          record.name = req.body.name;
          record.description = req.body.description;
          record.provenance = req.body.provenance;
          record.genotype = req.body.genotype;
          record.sequence = req.body.sequence;
          record.category = req.body.category;
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
  router.get("/virtuals/:recordId", getRecordById, (req, res) => {
    let jsonResponse = {
      message: res.locals.message,
      data: res.locals.data
    };
    res.json(jsonResponse);
  });

  // list all records
  router.get("/virtuals", getAllRecords, (req, res) => {
    let jsonResponse = {
      message: res.locals.message,
      data: res.locals.data
    };
    res.json(jsonResponse);
  });
};

function getAllRecords(req, res, next) {
  if (process.env.NODE_ENV === 'test') {
    Virtual.find({}, {}, { sort: { name: 1 } })
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
    Virtual.find({}, {}, { sort: { name: 1 } })
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
    Virtual
    .findOne({'_id': req.params.recordId})
    .exec((error, data) => {
      if(error) {
        res.locals.message = "There was a problem with retrieving the record.";
        res.locals.data = {};
      } else {
        res.locals.message = "The record was successfully retrieved.";
        res.locals.data = data;               
      }
      return next();
    });
  } else {
    Virtual
    .findOne({'_id': req.params.recordId})
    .exec((error, data) => {
      if(error) {
        res.locals.message = "There was a problem with retrieving the record.";
        res.locals.data = {};
      } else {
        res.locals.message = "The record was successfully retrieved.";
        res.locals.data = data;               
      }
      return next();
    });
  }
}   
