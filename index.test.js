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

describe("Test GET functionality", () => {

    it("Should get a bin by id", async () => {
        const res = await request(app).get(`/v3/b/${expectedRes.id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expectedRes);
    });

    test("if an illegal id is requested an appropriate response is sent", async () => {
        const res = await request(app).get(`/v3/b/${expectedRes.id}1`);
        expect(res.status).toBe(400);
        expect(res.text).toBe('{"message":"Invalid Bin Id provided"}')
    });
    test("if a bin is not found an appropriate response is sent", async () => {
        const res = await request(app).get(`/v3/b/a24eb7e7-9f4e-464d-9e55-b78d8ff5753c`);
        expect(res.status).toBe(404);
        expect(res.text).toBe('{"message":"Bin Not Found"}');
    });
});

describe("Testing the POST functionality", () => {

    it("can add a new bin", async () => {
        const res = await request(app).post('/v3/b').send(expectedRes);
        expect(res.status).toBe(200);
        expect(res.body.data.date).toEqual(expectedRes.date);
    });

    test("If can not add a bin with illegal body and an appropriate response is sent", async () => {
        const res = await request(app).post('/v3/b').send({});
        expect(res.status).toBe(400);
    });
});

describe("Testing the PUT functionality" ,() => {

    it("Should update a bin by id", async () => {
        const res = await request(app).put(`/v3/b/${expectedRes.id}`).send(putRes);
        expect(res.body.success).toBe(true);
    });

    test("no new bin is created when updating", async () => {
        const dirLength = fs.readdir(dir, (err, files) => files);
        const res = await request(app).put(`/v3/b/${expectedRes.id}`).send(expectedRes);
        const dirLengthAfter = fs.readdir(dir, (err, files) => files);
        expect(res.status).toBe(200);
        expect(dirLengthAfter).toEqual(dirLength);
    });

    test("if an illegal id is requested an appropriate response is sent", async () => {
        const res = await request(app).put(`/v3/b/${expectedRes.id}5`).send(expectedRes);
        expect(res.status).toBe(400);
        expect(res.body).toEqual({"message": "Invalid Bin Id provided"});
    });

    test("if a bin is not found an appropriate response is sent", async () => {
        const res = await request(app).put('/v3/b/a7cbb83e-056f-4753-a796-bbfe33ff68f0').send(putRes);
        expect(res.status).toBe(404);
        expect(res.body).toEqual({"message": "Bin Not Found"});
    });
});

describe("Testing DELETE functionality", () => {

    it("Should delete a bin by id", async () => {
        const res = await request(app).delete(`/v3/b/${expectedRes.id}`);
        expect(res.body.success).toBe(true);
        expect(res.body.id).toBe(expectedRes.id);
    });

    test("if an illegal id is requested an appropriate response is sent", async () => {
        const res = await request(app).delete(`/v3/b/${expectedRes.id}1`);
        expect(res.status).toBe(400);
        expect(res.text).toBe('{"message":"Invalid Bin Id provided"}')
    });

    test("if a bin is not found an appropriate response is sent", async () => {
        const res = await request(app).delete(`/v3/b/${expectedRes.id}`);
        expect(res.body.message).toBe("Bin not found or it doesn't belong to your account")
    });
});