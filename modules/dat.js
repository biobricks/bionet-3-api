// dat middleware

module.exports = {
  // is the id in the url a dat key?
  checkForDat: async (req, res, next) => {
    let id = req.params.recordId;
    let datFound = false;
    let dat = null;
    // check for dat
      // if dat found 
        // datFound = true;
        // dat = returned data.json from dat    
    // return results and proceed on to rest of route
    res.locals.datFound = datFound;
    res.locals.dat = dat;
    next();
  }  
};