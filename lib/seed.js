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
  console.log('admins returned', response.admins.length);
  console.log('labs returned', response.labs.length);
  console.log('lab containers returned', response.labContainers.length);
  console.log('lab containers level 3 returned', response.level3Array.length);
  response.connection.close();
});


async function seedDB(connString, connOptions) {
  try {
    let connection = await connectToDB(connString, connOptions);
    let admins = await getAdmins();
    let labs = [];
    let labContainers = [];
    let level3Array = [];
    for(let adminIndex = 0; adminIndex < admins.length; adminIndex++){
      let admin = admins[adminIndex];
      let lab = await createModel(Lab, {
        name: `${admin.username}Lab`,
        description: "This is an example Lab."
      }, admin);
      labs.push(lab);
      labContainers = await createChildContainers(10, admin, lab);
      for(let level3Index = 0; level3Index < labContainers.length; level3Index++){
        let labContainer = labContainers[level3Index];
        let level3ArrayAddition = await createChildContainers(10, admin, lab, labContainer);
        for(let i = 0; i < level3ArrayAddition.length; i++){
          level3Array.push(level3ArrayAddition[i]);
        }
      } 
    }
    return {
      connection,
      admins,
      labs,
      labContainers,
      level3Array
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

async function createModel(Model, attributes, user, lab=null, parent=null) {
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