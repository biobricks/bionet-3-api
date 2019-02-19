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
      createdBy: req.body.createdBy,
      updatedBy: req.body.createdBy,
      name: req.body.name,
      description: req.body.description,
      isAvailable: req.body.isAvailable,
      provenance: req.body.provenance,
      genotype: req.body.genotype,
      sequence: req.body.sequence,
      fgSubmitted: req.body.fgSubmitted,
      fgStage: req.body.fgStage,
      category: req.body.category
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
    Virtual.findOneAndDelete(req.params.recordId)
    .exec(error => {
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
    Virtual.findOne({ _id: req.params.recordId })
    .exec((err, record) => {
      record.updatedAt = new Date();
      record.updatedBy = req.body.updatedBy;
      record.name = req.body.name || record.name;
      record.description = req.body.description || record.description;
      record.provenance = req.body.provenance || record.provenance;
      record.genotype = req.body.genotype || record.genotype;
      record.sequence = req.body.sequence || record.sequence;
      record.category = req.body.category || record.category;
      record.isAvailable = req.body.isAvailable === true;
      record.fgSubmitted = req.body.fgSubmitted === true;
      record.fgStage = req.body.fgStage;
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
          //console.log('success', JSON.stringify(jsonResponse, null, 2));
        }
        res.json(jsonResponse);
      });
    });
  });

  // show one record
  router.get("/virtuals/:recordId", (req, res) => {
    const query = process.env.NODE_ENV === 'test' ? (
      Virtual.findOne({_id: req.params.recordId}) 
    ) : ( 
      Virtual
      .findOne({_id: req.params.recordId})
      .populate({
        path: 'createdBy',
        select: '_id username'
      })
      .populate({
        path: 'updatedBy',
        select: '_id username'
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
