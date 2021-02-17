const express = require('express');
const fs = require('fs');
const app = express();


app.get('/v3/b/:id', (req, res) => {
    const id = req.params.id;
    try{
        const binContent = fs.readFileSync(`./bins/${id}.json`);
        res.send(binContent);
    } catch(e) {
        res.status(422).json({"message":"Invalid Record ID"});
    }
});

app.listen(3000, () => {
    console.log("app is running on port 3000");
});

