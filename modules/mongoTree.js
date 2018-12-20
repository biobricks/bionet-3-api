const User = require("../models/User");
const Lab = require("../models/Lab");
const Container = require("../models/Container");

let pathGlobal = [];

module.exports = {
  getPathToLab: (labId, itemId, Model, cb) => {
    let response = {
      success: false,
      message: "",
      error: {},
      data: []
    };
    getPath(labId, itemId, Model)
    .then((res) => {
      //console.log('getLab res', res);
      response.success = true;
      response.message = "Everything went great.";
      response.data = res;
      //console.log('getLab response', response);
      return cb(null, response);
    })
    .catch((error) => {
      response.message = "There was an error.";
      response.error = error;
      return cb(error, response);
    });
  },
  getAllChildren: (record) => {

  }
}

async function getPath(labId, itemId, Model) {
  try {
    // reset global
    pathGlobal = [];
    // first is lab
    let lab = await Lab.findOne({'_id': labId}).populate('users');
    pathGlobal.push(lab);

    let item = await Model.findOne({'_id': itemId});
    
    if (item.parent !== null) {
      console.log('populating parent containers');  
      await populateParentContainers(item.parent);
    }
    // last is item
    pathGlobal.push(item);
    //console.log(lab);
    return pathGlobal;
  } catch (error) {
    console.log(error);
    return [];
  }  
}

async function populateParentContainers(id) {
  try {
    let item = await Container.findOne({'_id': id});
    pathGlobal.push(item);
    if (item.parent !== null){
      await populateParentContainers(item.parent); 
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }  
}

async function getChildren(id) {
  try {
    // get record by model function // lets make it and use it // ./fetch.js
  } catch (error) {

  }
}