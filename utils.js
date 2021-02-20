const fs = require('fs');


const checkId = (req, res, next) => {
    const { id } = req.params;
    if(id.length !== 36){
        res.status(400).send('{"message": "Invalid Bin Id provided"}');
    }
  
    next();
  };