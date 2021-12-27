"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const products_1 = require("./products");
const messages_1 = require("./messages");
const users_1 = require("./users");
const cart_1 = require("./cart");
const auth_1 = require("../middleware/auth");
const child_process_1 = require("child_process");
const __1 = require("..");
const facebook_1 = require("../passport/facebook");
exports.router = (0, express_1.Router)();
exports.router.use('/products', products_1.productsRouter);
exports.router.use('/cart', cart_1.cartRouter);
exports.router.use('/messages', messages_1.messagesRouter);
exports.router.use('/users', users_1.usersRouter);
exports.router.use('/auth', auth_1.authRouter);
exports.router.get('/info', (req, res) => {
    res.json({
        inputValues: facebook_1.commandData,
        platformName: process.platform,
        nodeJSVersion: process.version,
        memoryUsage: process.memoryUsage(),
        executionPath: process.execPath,
        processID: process.pid,
        folderPath: process.cwd(),
        CPUNumber: __1.CPUs
    });
});
exports.router.get('/die', (req, res) => {
    res.send(`Process ${process.pid} killed.`);
    process.exit();
});
exports.router.get('/randoms', (req, res) => {
    const howMany = req.query.amount;
    const forked = (0, child_process_1.fork)("./src/routes/non-block-function.ts");
    const whyDoIHaveTheFirstData = [];
    forked.send(howMany ? howMany : 100000000);
    forked.on("message", data => {
        whyDoIHaveTheFirstData.push(data);
        if (whyDoIHaveTheFirstData[1])
            res.json(whyDoIHaveTheFirstData[1]);
    });
});
