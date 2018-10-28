module.exports = {
  printPretty: (job) => {
    return JSON.stringify(job, null, 2);
  },
  print: (job) => {
    return JSON.stringify(job);
  }
}

// If job is from Bionet, immediately execute all tasks in job with the user being requester and operator. 
// If job is from OpenFoundry, queue up job to be executed at some point in time.
