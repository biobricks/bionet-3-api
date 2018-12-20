const User = require("../models/User");
const Virtual = require("../models/Virtual");
const jwt = require("jsonwebtoken");
const adminRequired = require("../modules/apiAccess").adminRequired;
const fetchAll = require("../modules/fetch").fetchAll;
const fetchOne = require("../modules/fetch").fetchOne;

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
  router.get("/virtuals/:recordId", (req, res) => {
    fetchOne(Virtual, req.params.recordId)
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
  router.get("/virtuals", (req, res) => {
    fetchAll(Virtual)
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
