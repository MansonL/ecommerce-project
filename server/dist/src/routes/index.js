"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const products_1 = require("./products");
const messages_1 = require("./messages");
const users_1 = require("./users");
const cart_1 = require("./cart");
const auth_1 = require("./auth");
const orders_1 = require("./orders");
const images_1 = require("./images");
exports.router = (0, express_1.Router)();
exports.router.use('/products', products_1.productsRouter);
exports.router.use('/cart', cart_1.cartRouter);
exports.router.use('/messages', messages_1.messagesRouter);
exports.router.use('/users', users_1.usersRouter);
exports.router.use('/auth', auth_1.authRouter);
exports.router.use('/orders', orders_1.ordersRouter);
exports.router.use('/images', images_1.imagesRouter);
/*

router.get('/info', (req: Request, res: Response) => {
    res.json({
        inputValues: commandData,
        platformName: process.platform,
        nodeJSVersion: process.version,
        memoryUsage: process.memoryUsage(),
        executionPath: process.execPath,
        processID: process.pid,
        folderPath: process.cwd(),
        CPUNumber: CPUs
    })
})

router.get('/die', (req: Request, res: Response) => {
    res.send(`Process ${process.pid} killed.`);
    process.exit();
});

router.get('/randoms', (req: Request, res: Response) => {
    const howMany = req.query.amount;
    const forked = fork("./src/routes/non-block-function.ts");
    const whyDoIHaveTheFirstData : any[]= []
    forked.send(howMany ? howMany : 100000000);
    forked.on("message", data => {
        whyDoIHaveTheFirstData.push(data);
        if(whyDoIHaveTheFirstData[1]) res.json(whyDoIHaveTheFirstData[1])
    });
    
})

*/
