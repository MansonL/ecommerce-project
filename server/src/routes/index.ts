import e, { Request, Response, Router } from 'express';
import { productsRouter } from './products';
import { messagesRouter } from './messages';
import { usersRouter } from './users';
import { cartRouter } from './cart';
import { authRouter } from './auth';
import { fork } from 'child_process';
import { CPUs } from '..';
import { commandData } from '../passport/facebook';
import { ordersRouter } from './orders';

export const router: e.Router = Router();
router.use('/products', productsRouter);
router.use('/cart', cartRouter);
router.use('/messages', messagesRouter);
router.use('/users', usersRouter);
router.use('/auth', authRouter)
router.use('/orders', ordersRouter)




router.post('/images', (req: Request, res: Response) => {
    const files = req.files;
    console.log(files)
})
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
