import { transports, createLogger, LoggerOptions, format, transport } from "winston";
const { combine, timestamp, colorize, printf } = format;

const options : LoggerOptions = {
    level: 'http',
    format: combine(
        colorize({level: true, colors: {http: 'green', info: 'blue', warn: 'yellow', error: 'red'}}),
        timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        printf(info => `${info.timestamp} | ${info.level} : ${info.message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: './logs/error.log',
            level: 'error'
        }),
        new transports.File({
            filename: './logs/warn.log',
            level: 'warn'
        })
    ]
}

export const logger = createLogger(options)