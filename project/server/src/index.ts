import { fork } from "child_process";
import cluster from "cluster";
import * as dotenv from 'dotenv'
import { cpus } from "os";
import path from 'path';
import { commandData } from "./passport/facebook";

import { app } from "./services/app";

const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });



export const PORT = commandData[0] && commandData[0].length  === 4 && !isNaN(Number(commandData[0])) ? Number(commandData[0]) : process.env.PORT; // Checking if the 
// first command argument is valid to use as PORT number.
export const CPUs = cpus().length

if(process.env.PROCESS_MODE === "FORK"){
    const child_server = fork('./src/server.ts');
    child_server.on("exit", () => {
        console.log(`Process ${process.pid} killed.`);
    })
}else{
    if(cluster.isMaster){
        console.log(`Primary process ${process.pid}`)
        for (let i = 0; i < CPUs; i++) {
            cluster.fork();
        }
        cluster.on("exit", worker => {
            console.log(`Worker ${worker.process.pid} died.`);
            cluster.fork();
        });

    }else{
        app.listen(PORT, () => {
            console.log(`Worker ${process.pid} server hosted at port ${PORT}`)
        })                 // Express server
    }
}