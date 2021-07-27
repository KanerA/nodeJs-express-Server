const express = require('express');
const app = express();
const v3 = require('./routes/v3/index');

app.use('/v3', v3);
app.use('*', (req, res) => {
  res.status(404).json({ message: "Page Not Found" })
})


module.exports = app ;
