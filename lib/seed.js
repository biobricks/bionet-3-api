#!/usr/bin/env node
require('../config/env.js');
process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const User = require('../models/User');
const Lab = require('../models/Lab');
const Container = require('../models/Container');
const Physical = require('../models/Physical');
const Virtual = require('../models/Virtual');

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
  response.connection.close();
});


async function seedDB(connString, connOptions) {
  try {
    let connection = await connectToDB(connString, connOptions);
    let admins = await getAdmins();
    let labs = [];
    let labContainers = [];
    let populatedLabs = [];
    for(let adminIndex = 0; adminIndex < admins.length; adminIndex++){
      let admin = admins[adminIndex];
      let lab = await createModel(Lab, {name: "Example Lab"}, admin);
      labs.push(lab);
      labContainers = await createChildContainers(10, admin, lab); 
    }
    // for(let labContainerIndex = 0; labContainerIndex < labContainers.length; labContainerIndex++) {
    //   let labContainer = labContainers[labContainerIndex];
    //   // create containers 
    //   let children = await createChildContainers(10);
    //   lab['children'] = children;
    //   populatedLabs.push(lab);
    // }
    return {
      connection,
      admins,
      labs,
      labContainers
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
      //connection.close();
    });
    
    connection.on('disconnected', () => {
      console.log('disconnected from db');
      //console.log('exiting...');
      //process.exit(1);
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
      obj.parent = parent && parent !== null ? parent._id : null;
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
    console.log('getAdmins');
    let admins = User.find({'isAdmin': true}, {username: 1, _id: 1}, {sort: {username: 1}});
    return admins;
  } catch (error) {
    throw error;
  }
}

async function createChildContainers(counterMax, creator, lab, parent=null, counter=0, resultArray=[]) {
  counter++;
  if (counter <= counterMax) {
    //let percentage = counter / (counterMax) * 100;
    //console.log(`${percentage}%`);
    let container = await createModel(Container, {
      parent,
      name: `Container ${counter}`,
      description: `This is an example container.`,
      rows: 10,
      columns: 10,
      category: 'General',
      locations: [[(counterMax - counter) + 1, (counterMax - counter) + 1]]
    }, creator, lab);
    resultArray.push(container);
    return await createChildContainers(counterMax, creator, lab, parent, counter, resultArray);
  } else {
    return resultArray;
  }
}