const utilsFunctions = require('./utils');
const request = require("supertest");
const app = require("./app.js");
const fs = require('fs');
const dir = "./test";

const expectedRes = {
    "priority": "5",
    "text": "Assaf Kaner",
    "date": "2021-02-23 21:30:07",
    "completed": false,
    "id": "a24eb7e7-9f4e-464d-9e55-b78d8ff5753d"
}

const putRes = {
    "priority": "5",
    "text": "Buy milk",
    "date": "2021-02-23 21:30:07",
    "completed": true,
    "id": "a24eb7e7-9f4e-464d-9e55-b78d8ff5753d"
}


beforeAll(() => {
    console.log("Seeding DB...");
    const binsDirExist = fs.existsSync(`${dir}`);
    if(!binsDirExist){ // if the bins directory does not exist, it creates one
        fs.mkdirSync(`${dir}`);
      } 
    fs.writeFileSync(
        `${dir}/${expectedRes.id}.json`,
        JSON.stringify(expectedRes)
    );
});
