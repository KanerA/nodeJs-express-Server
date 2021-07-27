const { Router } = require('express');
const b = require('./b/index');
const v3 = Router();

v3.use('/b', b);
v3.use('*', (req, res) => {
    res.status(404).json({ message: "Page Not Found" })
  })
  
module.exports = v3;