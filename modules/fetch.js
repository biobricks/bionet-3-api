const User = require("../models/User");
const Lab = require("../models/Lab");
const Container = require("../models/Container");
const Physical = require("../models/Physical");
const Virtual = require("../models/Virtual");
require("../config/env.js");

const mongoFetch = {
  fetchAll: async (Model) => {
    try {
      let results;
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
          results = await Model.find()
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
          });
          break;
        case Physical:
          results = await Model.find()
          .populate({
            path: 'parent',
            select: '_id name'
          })
          .populate({
            path: 'creator',
            select: '_id username'
          })
          .populate({
            path: 'lab',
            select: '_id name'
          })
          .populate('virtual');  
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
    } catch (error) {
      console.log('fetchAll.error', error);
    }  
  },
  fetchOne: async (Model, id) => {
    try {
      let isTestMode = process.env.NODE_ENV === 'test';
      let result, allContainers, allPhysicals;

      switch (Model) {
        case Lab:
          if (isTestMode) {
            result = await Model.findOne({_id: id});
          } else {        
            result = await Model.findOne({_id: id})
            .populate({
              path: 'createdBy',
              select: '_id username'
            })
            .populate({
              path: 'updatedBy',
              select: '_id username'
            })
            .populate({
              path: 'users',
              select: '_id username'
            }).populate({
              path: 'joinRequests',
              select: '_id username'
            });
            allContainers = await getAll(Container);
            allPhysicals = await getAll(Physical);
            result['children'] = await getChildren(result, allContainers, allPhysicals);
          }
          break;
        case Container:
          if (isTestMode) {
            result = await Model.findOne({_id: id});
          } else {
            result = await Model
            .findOne({_id: id})
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
            });
            allContainers = await getAll(Container);
            allPhysicals = await getAll(Physical);
            result['children'] = await getChildren(result, allContainers, allPhysicals);
          }
          break;  
        case Physical:
          if (isTestMode) {
            result = await Model.findOne({_id: id});
          } else {
            result = await Model.findOne({_id: id})
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
            .populate('virtual'); 
          }   
          break;  
        case Virtual:
          if (isTestMode) {
            result = await Model.findOne({_id: id});
          } else {
            result = await Model.findOne({_id: id})
            .populate({
              path: 'createdBy',
              select: '_id username'
            })
            .populate({
              path: 'updatedBy',
              select: '_id username'
            }); 
          } 
          break;      
        default:
          result = null;
      }

      return result;
    } catch (error) {
      console.log('fetchOne.error', error);
    }  
  }
};

module.exports = mongoFetch;

async function getAll(Model) {
  let results;
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
}

async function getChildren(record, allContainers, allPhysicals) {
  try {
    // filter all containers into children of record
    let containers = [];
    for(let i = 0; i < allContainers.length; i++){
      let container = allContainers[i];
      let containerChildOfLab = container.parent === undefined || container.parent === null;
      let containerMatchesParent = false;
      if (containerChildOfLab && String(container.lab._id) === String(record._id)) {
        containerMatchesParent = true;
      } else if (!containerChildOfLab && String(container.parent._id) === String(record._id)) {
        containerMatchesParent = true;
      }
      //let containerMatchesParent = containerChildOfLab ? String(container.lab._id) === String(record._id) : String(container.parent._id) === String(record._id);
      
      if (containerMatchesParent) {
        container.children = await getChildren(container, allContainers, allPhysicals);
        containers.push(container);
      }
    }

    // filter all physicals into children of record
    let physicals = [];
    for(let i = 0; i < allPhysicals.length; i++){
      let physical = allPhysicals[i];
      let physicalChildOfLab = physical.parent === undefined || physical.parent === null;
      if (physicalChildOfLab) {
        if (String(physical.lab._id) === String(record._id)) {
          physicals.push(physical);
        }
      } else {
        if (String(physical.parent._id) === String(record._id)) {
          physicals.push(physical);
        }        
      }
    }

    let result = { 
      'containers': containers, 
      'physicals': physicals 
    };
    return result;
  } catch (error) {
    console.log(error);
  }
}