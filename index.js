const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const dir = './bins';
app.use(express.json());

const bins =[];

app.get('/v3/b', (req, res) => {
  const binsContent = [];
  try{
    fs.readdir(dir, (err, files) => { 
      if(!files){
        res.status(200).send('No files to show');
      }
      for(file of files){
        const fileContent = JSON.parse(fs.readFileSync(`./bins/${file}`));
        let temp = fileContent.body;
        binsContent.push(temp);
      }
      res.send(JSON.stringify(binsContent));
    })
  } catch(err) {
    console.log(err + "Error");
  }
});

app.get('/v3/b/:id', (req, res) => {
    const {id} = req.params;
    try{
        const binContent = fs.readFileSync(`./bins/${id}.json`);
        res.send(binContent);
    } catch(e) {
        res.status(422).json({"message":"Invalid Record ID"});
    }
});

app.put('/v3/b/:id', (req, res) => {
    const body = req.body;
    const {id} = req.params;
    const binExist = fs.existsSync(`./bins/${id}.json`);
    if(!binExist){
        res.status(404).json({
            "message": "Bin not found",
            "success": false
          });
        return;
    }
    fs.writeFileSync(`./bins/${id}.json`, JSON.stringify(({body , "id": id}),null,4));
    const successMessage = {
        success: true,
        data: body,
        "version": 1,
        "parentId": id
    }
    res.send(successMessage);
});

app.post('/v3/b', (req, res) => {
    const {body} = req;
    const binId = uuidv4();
    try {
        fs.writeFileSync(
          `./bins/${binId}.json`,
          JSON.stringify( {body , 'id': binId}, null, 4)
        );
        res.status(200).send(JSON.stringify({"success":"true", "data":body , "id":binId}));
      } catch (e) {
        res.status(500).json(JSON.stringify({ message: "Error!", error: e }));
      } 
});

app.delete('/v3/b/:id', (req, res) => {
  const {id} = req.params;
  console.log('hello');
  try{
    fs.unlinkSync(`./bins/${id}.json`);
    console.log('file deleted successfully');
    res.json(JSON.stringify({"success": true, "id": id, "message": "Bin "+ id +" is deleted successfully."}));
  } catch{
    res.status(404).json({"message": "Bin not found","success": false})
  };
});

app.listen(3000, () => {
    console.log("app is running on port 3000");
});