#!/usr/bin/env node
require('../config/env.js');
process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const User = require('../models/User');
const Lab = require('../models/Lab');
const Container = require('../models/Container');
const Physical = require('../models/Physical');
const Virtual = require('../models/Virtual');
const shortid = require('shortid');

const connectionString = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URI}`;
const connectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  family: 4
};

seedDB(connectionString, connectionOptions)
.then((response) => {
  console.log('admins created', response.admins.length);
  console.log('labs created - level 1', response.labs.length);
  console.log('lab containers created - level 2', response.labContainers.length);
  console.log('lab containers created - level 3', response.level3Array.length);
  console.log('virtuals created', response.virtualsArray.length);
  console.log('physicals created', response.physicalsArray.length);
  response.connection.close();
});


async function seedDB(connString, connOptions) {
  try {
    let connection = await connectToDB(connString, connOptions);
    let admins = await getAdmins();
    let labs = [];
    let labContainers = [];
    let level3Array = [];
    let virtualsArray = [];
    let physicalsArray = [];
    // lab per admin
    // 3 containers per container x 5 per lab
    for(let adminIndex = 0; adminIndex < admins.length; adminIndex++){
      let admin = admins[adminIndex];
      let adminVirtuals = [];
      //virtuals per admin
      for(let i = 0; i < 15; i++){
        let virtual = await createModel(Virtual, {
          name: randomName(),
          description: "This is an example Virtual.",
          provenance: "Example Provenance",
          genotype: "Example Genotype",
          sequence: "AGTCAGCTAGTCAGCTAGTCAGCTAGTCAGCTAGTCAGCTAGTCAGCT",
          category: "Sample"
        }, admin);
        virtualsArray.push(virtual);
        adminVirtuals.push(virtual);
      } 

      // create level 1 - lab for admin
      let lab = await createModel(Lab, {
        name: `${admin.username}Lab`,
        description: "This is an example Lab."
      }, admin);
      labs.push(lab);

      
      // create level 2 - containers in lab
      labContainers = await createChildContainers(5, admin, lab);
      let containerCounter = 0;
      for(let level2Index = 0; level2Index < labContainers.length; level2Index++){
        let labContainer = labContainers[level2Index];

        // create level 3 - containers in lab containers
        let level3ArrayAddition = await createChildContainers(3, admin, lab, labContainer);
        for(let level3Index = 0; level3Index < level3ArrayAddition.length; level3Index++){
          let level3Container = level3ArrayAddition[level3Index];
          level3Array.push(level3Container);
          // level 3 container physicals
          let physical = await createModel(Physical, {
            name: `${adminVirtuals[containerCounter].name}_${containerCounter + 1}`,
            description: `This is an example physical instance of ${adminVirtuals[containerCounter].name}`,
            parentRow: 2,
            parentColumn: 3 
          }, admin, lab, level3Container, adminVirtuals[containerCounter]);
          physicalsArray.push(physical);
          containerCounter++;
        }
      }
    }
    return { 
      connection,
      admins,
      labs,
      labContainers,
      level3Array,
      virtualsArray,
      physicalsArray
    };
  } catch (error) {
    throw error;
  }
}

async function connectToDB(connString, connOptions) {
  try {

    mongoose.Promise = global.Promise;
    mongoose.connect(connString, connOptions);
    
    const connection = mongoose.connection;
    
    connection.on('connected', () => {
      console.log('connected to db');
    });
    
    connection.on('disconnected', () => {
      console.log('disconnected from db');
    });

    return connection;
  } catch (error) {
    throw error;
  }  
}

async function createModel(Model, attributes, user, lab=null, parent=null, virtual=null) {
  try {
    let obj = new Model(attributes);
    if (Model == Lab) {
      obj.users.push(user._id);
      obj.rows = 10;
      obj.columns = 10;
    } else if (Model == Container) {
      obj.creator = user._id;
      obj.parent = parent !== null ? parent._id : null;
      obj.lab = lab._id;
      obj.rows = 10;
      obj.columns = 10;
    } else if (Model == Virtual) {
      obj.creator = user._id;
    } else if (Model == Physical) {
      obj.creator = user._id;
      obj.virtual = virtual._id;
      obj.parent = parent._id;
      obj.lab = lab._id;
    }
    let savedObj = await obj.save();
    return savedObj;
  } catch (error) {
    throw error;
  }
}

async function getAdmins() {
  try {
    let admins = User.find({'isAdmin': true}, {username: 1, _id: 1}, {sort: {username: 1}});
    return admins;
  } catch (error) {
    throw error;
  }
}

async function createChildContainers(counterMax, creator, lab, parent=null, counter=0, resultArray=[]) {
  counter++;
  if (counter <= counterMax) {
    let container = await createModel(Container, {
      name: shortid.generate(),
      description: `This is an example container.`,
      rows: 10,
      columns: 10,
      category: 'General',
      locations: [[(counterMax - counter) + 1, (counterMax - counter) + 1]]
    }, creator, lab, parent);
    resultArray.push(container);
    return await createChildContainers(counterMax, creator, lab, parent, counter, resultArray);
  } else {
    return resultArray;
  }
}

function randomName() {
  let prefixArray = ["Foo", "Bar", "Baz", "Quay"];
  let short = shortid.generate().split('').splice(1,4).join('');
  return `${prefixArray[randomInt(0,3)]}${short}`;
}

function randomInt(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomBoolean() {
  return randomInt(0,1) === 1;
}