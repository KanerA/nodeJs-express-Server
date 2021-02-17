const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

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
    console.log("body:", body);
    const {id} = req.params;
    const binExist = fs.existsSync(`./bins/${id}.json`);
    if(!binExist){
        res.status(404).json({
            "message": "Bin not found",
            "success": false
          });
        return;
    }
    fs.writeFileSync(`./bins/${id}.json`, JSON.stringify(body,null,4));
    const successMessage = {
        success: true,
        data: body,
        "version": 1,
        "parentId": id
    }
    res.send(successMessage);
});

app.post('/v3/b/:id', (req, res) => {
    const {body} = req;
    const {id} = req.params;
    try {
        fs.writeFileSync(
          `./bins/${id}.json`,
          JSON.stringify(body, null, 4)
        );
        res.status(200).json(`
        {
            "record": 
              ${JSON.stringify(body)}
            ,
            "metadata": {
              "id": "${id},
              "createdAt": ${Date.now()}
            }
          }
        `);
      } catch (e) {
        res.status(500).json({ message: "Error!", error: e });
      }
})

app.listen(3000, () => {
    console.log("app is running on port 3000");
});

