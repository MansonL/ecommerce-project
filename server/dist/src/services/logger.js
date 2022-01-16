"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const { combine, timestamp, colorize, printf } = winston_1.format;
const options = {
    level: 'http',
    format: combine(colorize({ level: true, colors: { http: 'green', info: 'blue', warn: 'yellow', error: 'red' } }), timestamp({
        format: 'MMM-DD-YYYY HH:mm:ss'
    }), printf(info => `${info.timestamp} | ${info.level} : ${info.message}`)),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({
            filename: './logs/error.log',
            level: 'error'
        }),
        new winston_1.transports.File({
            filename: './logs/warn.log',
            level: 'warn'
        })
    ]
};
exports.logger = (0, winston_1.createLogger)(options);
