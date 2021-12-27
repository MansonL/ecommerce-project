"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorApi_1 = require("./errorApi");
const errorHandler = (error, req, res, next) => {
    console.log(`Inside error handler.`);
    console.log(error);
    if (error instanceof errorApi_1.ApiError) {
        res.status(error.error).send(error.message);
    }
    else {
        res.status(500).send(`Something went wrong.`);
    }
};
exports.errorHandler = errorHandler;
