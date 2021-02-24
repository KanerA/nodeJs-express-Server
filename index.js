const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { checkId } = require('./utils');
const { checkBin } = require('./utils');
const { checkIfBlank } = require('./utils');
const { timeOut } = require('./utils');
const app = express();
const dir = './bins';
app.use(timeOut);
app.use(express.json());


app.get('/v3/b', (req, res) => {
  const binsContent = [];
    fs.readdir(dir, (err, files) => { 
        for(file of files){
          const fileContent = JSON.parse(fs.readFileSync(`./bins/${file}`));
          let temp = fileContent;
          binsContent.push(temp);
        }
        res.status(200).send(JSON.stringify(binsContent));
    })
});

app.get('/v3/b/:id', checkId, checkBin, (req, res) => {
    const {id} = req.params;
      const binContent = fs.readFileSync(`./bins/${id}.json`);
      res.send(binContent);
});

app.put('/v3/b/:id', checkId, checkBin, checkIfBlank, (req, res) => {
    const {body} = req;
    const {id} = req.params;
    fs.writeFileSync(`./bins/${id}.json`, JSON.stringify(body, null, 4));
    const successMessage = {
        success: true,
        data: body,
        "version": 1,
        "parentId": id
    }
    res.send(successMessage);
});

app.post('/v3/b', checkIfBlank, (req, res) => {
  const {body} = req;
    const binId = uuidv4();
    const binsDirExist = fs.existsSync(`./bins`);
    if(!binsDirExist){ // if the bins directory does not exist, it creates one
      fs.mkdirSync('./bins');
    } 
    body.id = binId;
    fs.writeFileSync(
    `./bins/${binId}.json`, JSON.stringify( body, null, 4));
    res.status(200).json({"success":"true", "data":body , "id":binId}); 
});

app.delete('/v3/b/:id', checkId, (req, res) => {
  const {id} = req.params;
  try{
    fs.unlinkSync(`./bins/${id}.json`);
    console.log('file deleted successfully');
    res.json({"success": true, "id": id, "message": "Bin "+ id +" was deleted successfully."});
  } catch(err){
    res.status(401).json({"message": "Bin not found or it doesn't belong to your account", err})
  };
});

app.listen(3000, () => {
    console.log("app is running on port 3000");
});

module.exports = app ;
