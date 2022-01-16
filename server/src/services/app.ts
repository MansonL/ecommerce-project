import express from 'express';
import cors from 'cors';
import { router } from '../routes';
import { errorHandler } from '../middleware/errorHandler';
import { unknownRoute } from '../middleware/unknownRoute';
import { mongoConnection } from '../models/DAOs/Mongo/connection';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import passport from '../passport/facebook'
import fileUpload from 'express-fileupload';
import { Config } from '../config/config';
import { serve, setup } from 'swagger-ui-express';

const outputFile = require('../doc/doc.json');

export const app: express.Application = express();
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "UPDATE", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));
app.use(session({
    secret: Config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({
        clientPromise: mongoConnection(),
        stringify: false,
        autoRemove: 'interval',
        autoRemoveInterval: 1,
    }),
    cookie: {
        maxAge: Number(Config.SESSION_COOKIE_TIMEOUT),
        httpOnly: true,
    }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/doc', serve, setup(outputFile));
app.use('/api', router);
app.use(errorHandler);
app.use(unknownRoute);

