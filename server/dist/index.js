"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPUs = exports.PORT = void 0;
const child_process_1 = require("child_process");
const cluster_1 = __importDefault(require("cluster"));
const dotenv = __importStar(require("dotenv"));
const os_1 = require("os");
const path_1 = __importDefault(require("path"));
const facebook_1 = require("./passport/facebook");
const app_1 = require("./services/app");
const envPath = path_1.default.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
console.log(facebook_1.commandData);
exports.PORT = facebook_1.commandData[0] && facebook_1.commandData[0].length === 4 && !isNaN(Number(facebook_1.commandData[0])) ? Number(facebook_1.commandData[0]) : process.env.PORT; // Checking if the 
// first command argument is valid to use as PORT number.
exports.CPUs = (0, os_1.cpus)().length;
if (process.env.PROCESS_MODE === "FORK") {
    const child_server = (0, child_process_1.fork)('./src/server.ts');
    child_server.on("exit", () => {
        console.log(`Process ${process.pid} killed.`);
    });
}
else {
    if (cluster_1.default.isMaster) {
        console.log(`Primary process ${process.pid}`);
        for (let i = 0; i < exports.CPUs; i++) {
            cluster_1.default.fork();
        }
        cluster_1.default.on("exit", worker => {
            console.log(`Worker ${worker.process.pid} died.`);
            cluster_1.default.fork();
        });
    }
    else {
        app_1.app.listen(exports.PORT, () => {
            console.log(`Worker ${process.pid} server hosted at port ${exports.PORT}`);
        }); // Express server
    }
}
