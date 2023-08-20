const jwt = require("jsonwebtoken");
require('dotenv').config();

const ValidationForProducts = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const decoded = jwt.verify(token, process.env.key);
        if (decoded.adminID) {
            next();
        }
        else {
            res.send({ Message: "You are not an admin!" });
        }
    }
    else {
        res.send({ Message: "You are not an admin!" });
    }
};

module.exports = { ValidationForProducts };