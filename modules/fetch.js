const User = require("../models/User");
const Lab = require("../models/Lab");
const Container = require("../models/Container");
const Physical = require("../models/Physical");
const Virtual = require("../models/Virtual");

const mongoFetch = {
  fetchAll: async (Model) => {
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
  },
  fetchOne: async (Model, id) => {
    let isTestMode = process.env.NODE_ENV === 'test';
    let result;
    let allContainers = await getAll(Container);
    let allPhysicals = await getAll(Physical);
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
          result['children'] = await getChildren(result, allContainers, allPhysicals);
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
          result['children'] = await getChildren(result, allContainers, allPhysicals);
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
      let containerChildOfLab = container.parent === null;
      let containerMatchesParent = containerChildOfLab ? String(container.lab._id) === String(record._id) : String(container.parent._id) === String(record._id);
      if (containerMatchesParent) {
        container.children = await getChildren(container, allContainers, allPhysicals);
        containers.push(container);
      }
    }

    // filter all physicals into children of record
    let physicals = [];
    for(let i = 0; i < allPhysicals.length; i++){
      let physical = allPhysicals[i];
      if (physical.parent !== null) {
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