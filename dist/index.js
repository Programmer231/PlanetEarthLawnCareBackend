"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.datasource = void 0;
require("reflect-metadata");
const constants_1 = require("./constants");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const user_1 = require("./resolvers/user");
const Estimates_1 = require("./entities/Estimates");
const AdminUser_1 = require("./entities/AdminUser");
const RegularUser_1 = require("./entities/RegularUser");
const estimate_1 = require("./resolvers/estimate");
const AvailableJobs_1 = require("./entities/AvailableJobs");
const regularUser_1 = require("./resolvers/regularUser");
const path_1 = __importDefault(require("path"));
const JobRouter_1 = __importDefault(require("./router/JobRouter"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const EstimateRouter_1 = __importDefault(require("./router/EstimateRouter"));
require("dotenv").config();
exports.datasource = new typeorm_1.DataSource({
    type: "mongodb",
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    logging: true,
    //synchronize: true,
    //migrations: [path.join(__dirname, "./migrations/*")],
    entities: [AdminUser_1.AdminUser, RegularUser_1.RegularUser, AvailableJobs_1.AvailableJobs, Estimates_1.Estimates],
    useUnifiedTopology: true,
    useNewUrlParser: true,
    url: process.env.MONGODB_URL,
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.datasource.initialize();
    yield exports.datasource.runMigrations();
    const mongoDbStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
    const app = (0, express_1.default)();
    const PELCStore = new mongoDbStore({
        uri: process.env.MONGODB_URL,
        collection: "sessions",
    });
    app.set("trust proxy", 1);
    app.use((0, cors_1.default)({
        origin: [
            process.env.CORS_ORIGIN_DEV,
            "https://planetearthlawncare.org",
        ],
        credentials: true,
    }));
    const ApolloSessionMiddlewareCookies = (0, express_session_1.default)({
        name: process.env.COOKIENAME,
        store: PELCStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            secure: constants_1._prod_,
            httpOnly: true,
            domain: constants_1._prod_ ? ".planetearthlawncare.org" : undefined,
        },
        resave: false,
        saveUninitialized: false,
        secret: process.env.AUTHENTICATION_KEY,
    });
    app.use(ApolloSessionMiddlewareCookies);
    app.use("/images/jobs", express_1.default.static(path_1.default.join(__dirname, "images/jobs")));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [user_1.UserResolver, estimate_1.EstimateResolver, regularUser_1.RegularUserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res }),
        cache: "bounded",
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
    app.use(express_1.default.json());
    app.use((0, express_mongo_sanitize_1.default)());
    app.use("/jobs", JobRouter_1.default);
    app.use("/estimates", EstimateRouter_1.default);
    app.use((error, req, res, next) => {
        if (req.file) {
            fs_1.default.unlink(req.file.path, (err) => {
                console.log(err);
            });
        }
        if (req.files) {
            for (let file of req.files) {
                fs_1.default.unlink(file.path, (err) => {
                    console.log(err);
                });
            }
        }
        res.status(error.code || 500);
        return res.json({ message: error.message || "An unknown error occurred!" });
    });
    yield mongoose_1.default.connect(process.env.MONGODB_URL);
    app.listen(parseInt(process.env.PORT), () => {
        console.log("server started on localhost:4000");
    });
});
main().catch((err) => {
    console.error(err);
});
