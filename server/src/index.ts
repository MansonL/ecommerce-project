import { fork } from "child_process";
import cluster from "cluster";
import * as dotenv from 'dotenv'
import { cpus } from "os";
import path from 'path';
import { Config } from "./config/config";
import { commandData } from "./passport/facebook";

import { app } from "./services/app";

const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });



export const PORT = commandData[0] && commandData[0].length  === 4 && !isNaN(Number(commandData[0])) ? Number(commandData[0]) : Config.PORT; // Checking if the 
// first command argument is valid to use as PORT number.
export const CPUs = cpus().length

if(Config.MODE === "FORK"){
    const child_server = fork('./src/services/server.ts');
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

/**
 * Need to add the user_id to every cart, order & message.list/id message.save controller with req.user
 * 
 * Authorizations --> function as a middleware for authorized endpoints.
 * 
 * Users --> telephone field, pass & repeated validation.
 * 
 * Images --> full endpoint.
 * 
 * Products --> category endpoint.
 * 
 * Cart --> modifications for adding & deleting products with { id, quantity } = req.body 
 * 
 * All of cart endpoints needs authorization with Bearer JWT.
 * 
 * Orders --> full endpoint. 
 * All of orders endpoints needs authorization with Bearer JWT.
 * 
 */