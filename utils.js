const fs = require('fs');
const dir = process.env.NODE_ENV === 'test' ? './test':'./bins';


const checkId = (req, res, next) => {
    const { id } = req.params;
    if(id.length !== 36){
        res.status(400).json({"message": "Invalid Bin Id provided"});
    }
    next();
};

const checkBin = (req, res, next) => {
    const { id } = req.params;
    const binExist = fs.existsSync(`${dir}/${id}.json`);
    if(!binExist){
        res.status(404).json({"message": "Bin Not Found"});
        return;
    }
    next();
};

const checkIfBlank = (req, res, next) => {
    if(req.body && Object.keys(req.body).length === 0 && req.body.constructor === Object){
        res.status(400).send({"message": "Bin cannot be blank"});
        return;
    }
    next();
}

function timeOut(req, res, next){
    setTimeout(next, 1000);
}

module.exports = { checkId, checkBin, checkIfBlank, timeOut };