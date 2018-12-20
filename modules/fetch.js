const User = require("../models/User");
const Lab = require("../models/Lab");
const Container = require("../models/Container");
const Physical = require("../models/Physical");
const Virtual = require("../models/Virtual");

const mongoFetch = {
  fetchAll: async (Model) => { // making a /labs route to test require and use of this function
    let results;
    // each model requires different attribute population
    switch (Model) {
      case Lab:
        results = await Model.find().populate({
          path: 'users',
          select: '_id username'
        }).populate({
          path: 'joinRequests',
          select: '_id username'
        });
        break;
      case Container:
        results = await Model.find().populate({
          path: 'parent',
          select: '_id name'
        }).populate({
          path: 'creator',
          select: '_id username'
        }).populate({
          path: 'lab',
          select: '_id name'
        });
      case Physical:
        results = await Model.find().populate({
          path: 'parent',
          select: '_id name'
        }).populate({
          path: 'creator',
          select: '_id username'
        }).populate({
          path: 'lab',
          select: '_id name'
        }).populate('virtual');  
        break; 
      case Virtual:
        results = await Model.find().populate({
          path: 'creator',
          select: '_id username'
        });  
        break;    
      default:
        results = null;
    }
    return results;
  },
  fetchOne: async (Model, id) => {
    let isTestMode = process.env.NODE_ENV === 'test';
    let result;
      // each model requires different attribute population
      if (!isTestMode) {
        switch (Model) {
          case Lab:
            result = await Model.findOne({_id: id}).populate({
              path: 'users',
              select: '_id username'
            }).populate({
              path: 'joinRequests',
              select: '_id username'
            });
            break;
          case Container:
            result = await Model.findOne({_id: id}).populate({
              path: 'parent',
              select: '_id name'
            }).populate({
              path: 'creator',
              select: '_id username'
            }).populate({
              path: 'lab',
              select: '_id name'
            });
            result['children'] = await fetchAllByParent(id);
            break;  
          case Physical:
            result = await Model.findOne({_id: id}).populate({
              path: 'parent',
              select: '_id name'
            }).populate({
              path: 'creator',
              select: '_id username'
            }).populate({
              path: 'lab',
              select: '_id name'
            }).populate('virtual');  
            break;  
          case Virtual:
            result = await Model.findOne({_id: id}).populate({
              path: 'creator',
              select: '_id username'
            });  
            break;      
          default:
            result = null;
        }
      } else {
        // test mode without populate
        result = await Model.findOne({_id: id});
      }  
      return result;
  },
  fetchAllByParent: async (id) => {
    let allContainers = await this.fetchAll(Container);
    let allPhysicals = await this.fetchAll(Physical);
    let containers, physicals = [];
    for(let i = 0; i < allContainers.length; i++){
      let container = allContainers[i];
      if (container.parent && container.parent === id) {
        containers.push(container);
      }
    }
    for(let i = 0; i < allPhysicals.length; i++){
      let physical = allPhysicals[i];
      if (physical.parent && physical.parent === id) {
        physicals.push(physical);
      }
    }
    let result = { containers, physicals };
    return result;
  },
  fetchOneWithChildren: async (Model, id) => {
    let record = await this.fetchOne(Model, id);
    let children = await this.fetchAllByParent(record._id);
    record['children']['physicals'] = physicals; // using [] instead of . syntax on attribute creation can prevent errors
    record['children']['containers'] = containers;
    let result = {
      record,
      physicals: children.physicals,
      containers: children.containers
    };
    console.log(result)
    return result;
  }
};

module.exports = mongoFetch;

async function fetchAllByParent(id) {
  let allContainers = await mongoFetch.fetchAll(Container);
  console.log(allContainers);
  let allPhysicals = await mongoFetch.fetchAll(Physical);
  let containers, physicals = [];
  // for(let i = 0; i < allContainers.length; i++){
  //   let container = allContainers[i];
  //   if (container.parent && container.parent === id) {
  //     containers.push(container);
  //   }
  // }
  // for(let i = 0; i < allPhysicals.length; i++){
  //   let physical = allPhysicals[i];
  //   if (physical.parent && physical.parent === id) {
  //     physicals.push(physical);
  //   }
  // }
  let result = { containers, physicals };
  return result;
}

// let tree = [];
// async function getChildren(id) {
//   try {
//     let record;
//   } catch (error) {
//     console.log('getChildren error', error);
//     return;
//   }
// }

// example from other file
// provides the structure, need to move it to this context
// let pathGlobal = []; 

// async function populateParentContainers(id) {
//   try {
//     let item = await Container.findOne({'_id': id});
//     pathGlobal.push(item);
//     if (item.parent !== null){
//       await populateParentContainers(item.parent); 
//     } else {
//       return null;
//     }
//   } catch (error) {
//     return null;
//   }  
// }

// let allChildren = [];

// getChildren: async (parent) => { 
//   await Containers.findAll({parent: parent._id}, (err, children) => {
//      for(i = 0, i < children.length; i++) {
//        allChildren.push(children[i]);
//        getChildren(children[i]);
//      }
//   }
// } just notes comparing with what you are about to do
// go ahead and drop it in if you understand what comes next
// Oh I dont, i just am studying and keeping this here for my notes.
// Well you dropped the correct code snippet in, this is the part where that logic goes in,
// let's see if I can copy and paste, then modify the naming convention 