"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("../routes");
const errorHandler_1 = require("../utils/errorHandler");
const unknownRoute_1 = require("../utils/unknownRoute");
const connection_1 = require("../models/DAOs/Mongo/connection");
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = __importDefault(require("../passport/index"));
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "UPDATE", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
}));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    store: connect_mongo_1.default.create({
        clientPromise: (0, connection_1.mongoConnection)(),
        stringify: false,
        autoRemove: 'interval',
        autoRemoveInterval: 1,
    }),
    cookie: {
        maxAge: 1000 * 60 * 10,
        httpOnly: true,
    }
}));
exports.app.use(index_1.default.initialize());
exports.app.use(index_1.default.session());
exports.app.use('/api', routes_1.router);
exports.app.use(errorHandler_1.errorHandler);
exports.app.use(unknownRoute_1.unknownRoute);
