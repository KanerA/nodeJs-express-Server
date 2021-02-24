const utilsFunctions = require('./utils');
const request = require("supertest");
const app = require("./index.js");

const expectedRes = [{
    "priority": "4",
    "text": "Assaf Kaner",
    "date": "2021-02-23 21:30:07",
    "completed": false,
    "id": "78a75065-637f-4421-8885-09db04a8860c"
}]


describe("Test GET functionality", () => {
    it("Should get a bin by id", async () => {
        const res = await request(app).get("/v3/b");
        console.log(res.text);
        expect(res.text).toEqual(expectedRes);
    })
})