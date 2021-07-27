const express = require('express');
const { Router } = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { checkId } = require('../../../utils');
const { checkBin } = require('../../../utils');
const { checkIfBlank } = require('../../../utils');
const { timeOut } = require('../../../utils');
const dir = process.env.NODE_ENV === 'test' ? '../../../test':'../../../bins';
const b = Router();

b.use(timeOut);
b.use(express.json());

b.get('/', (req, res) => {
    const binsContent = [];
      fs.readdir(dir, (err, files) => { 
          for(file of files){
            const fileContent = JSON.parse(fs.readFileSync(`${dir}/${file}`));
            let temp = fileContent;
            binsContent.push(temp);
          }
          res.status(200).send(binsContent);
      })
  });
  
  b.get('/:id', checkId, checkBin, (req, res) => {
      const {id} = req.params;
        const binContent = fs.readFileSync(`${dir}/${id}.json`);
        res.json(JSON.parse(binContent));
  });
  
  b.put('/:id', checkId, checkBin, checkIfBlank, (req, res) => {
      const {body} = req;
      const {id} = req.params;
      fs.writeFileSync(`${dir}/${id}.json`, JSON.stringify(body, null, 4));
      const successMessage = {
          success: true,
          data: body,
          "version": 1,
          "parentId": id
      }
      res.send(successMessage);
  });
  
  b.post('/', checkIfBlank, (req, res) => {
    const {body} = req;
      const binId = uuidv4();
      const binsDirExist = fs.existsSync(`${dir}`);
      if(!binsDirExist){ // if the bins directory does not exist, it creates one
        fs.mkdirSync(`${dir}`);
      } 
      body.id = binId;
      fs.writeFileSync(
      `${dir}/${binId}.json`, JSON.stringify( body, null, 4));
      res.status(200).json({"success":"true", "data":body , "id":binId}); 
  });
  
  b.delete('/:id', checkId, (req, res) => {
    const {id} = req.params;
    try{
      fs.unlinkSync(`${dir}/${id}.json`);
      console.log('file deleted successfully');
      res.json({"success": true, "id": id, "message": "Bin "+ id +" was deleted successfully."});
    } catch(err){
      res.status(401).json({"message": "Bin not found or it doesn't belong to your account", err})
    };
  });
  
  module.exports = b;
