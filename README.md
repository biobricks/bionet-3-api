# BioNet 3 API [![Build Status](https://travis-ci.org/biobricks/bionet-3-api.svg?branch=master)](https://travis-ci.org/biobricks/bionet-3-api)[![Coverage Status](https://coveralls.io/repos/github/biobricks/bionet-3-api/badge.svg?branch=master)](https://coveralls.io/github/biobricks/bionet-3-api?branch=master)
In Development. A Node Express Server that interfaces with the [Bionet 3 Client](https://github.com/biobricks/bionet-3-client).

## Install

### Clone
From your terminal:
```
git clone https://github.com/biobricks/bionet-3-api.git
```

### Change Directory To Project
```
cd bionet-3-api
```

## Configure
In local development, the environment variables are expected to be located in `/config/env.js` which is not included in the git commit as it contains secure information not to be shared with the public.  
In production the environment variables should be applied prior to deployment.  
Below is an example that you can fill out and save to `/config/env.js`:
```
// /config/env.js
process.env.DB_USERNAME = "myDbUsername";
process.env.DB_PASSWORD = 'myDbPassword';
process.env.DB_URI = 'ds123456.mlab.com:12345/mydbname';
process.env.DB_TEST_URI = 'ds123456.mlab.com:12345/mytestdbname';
process.env.JWT_SECRET = 'mySuperSecretPasswordPhrase';
```

### Install Modules
```
npm install
```

### Run
```
npm start
```

### Run Tests
```
npm test
```

