import "reflect-metadata";
import { _prod_ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import session from "express-session";
import { MyContext } from "./types";
import mongoSession from "connect-mongodb-session";
import cors from "cors";
import { DataSource } from "typeorm";
import { UserResolver } from "./resolvers/user";
import { Estimates } from "./entities/Estimates";
import { AdminUser } from "./entities/AdminUser";
import { RegularUser } from "./entities/RegularUser";
import { EstimateResolver } from "./resolvers/estimate";
import { AvailableJobs } from "./entities/AvailableJobs";
import { RegularUserResolver } from "./resolvers/regularUser";
import path from "path";
import FileUploadRoutes from "./router/JobRouter";
import fs from "fs";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import ExpressMongoSanitize from "express-mongo-sanitize";

require("dotenv").config();
declare module "express-session" {
  interface Session {
    userId?: string;
    admin?: boolean;
    employee?: boolean;
    customer?: boolean;
  }
}

export const datasource = new DataSource({
  type: "mongodb",
  database: process.env.DATABASE,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  logging: true,
  //synchronize: true,
  //migrations: [path.join(__dirname, "./migrations/*")],
  entities: [AdminUser, RegularUser, AvailableJobs, Estimates],
  useUnifiedTopology: true,
  useNewUrlParser: true,
  url: process.env.MONGODB_URL,
});

const main = async () => {
  await datasource.initialize();

  await datasource.runMigrations();

  const mongoDbStore = mongoSession(session);

  const app = express();

  const PELCStore = new mongoDbStore({
    uri: process.env.MONGODB_URL as string,
    collection: "sessions",
  });

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: [
        process.env.CORS_ORIGIN_DEV as string,
        "https://planetearthlawncare.org",
      ],
      credentials: true,
    })
  );
  const ApolloSessionMiddlewareCookies = session({
    name: process.env.COOKIENAME as string,
    store: PELCStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
      secure: _prod_,
      httpOnly: true,
      domain: _prod_ ? ".planetearthlawncare.org" : undefined,
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.AUTHENTICATION_KEY as string,
  });

  app.use(ApolloSessionMiddlewareCookies);
  app.use("/images", express.static(path.join(__dirname, "images")));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, EstimateResolver, RegularUserResolver],
      validate: false,
    }),
    context: ({ req, res }: MyContext) => ({ req, res }),
    cache: "bounded",
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.use(express.json());
  app.use(ExpressMongoSanitize());

  app.use("/jobs", FileUploadRoutes);

  app.use((error: any, req: any, res: any, next: any) => {
    if (req.file) {
      fs.unlink(req.file.path, (err: any) => {
        console.log(err);
      });
    }
    if (req.files) {
      for (let file of req.files) {
        fs.unlink(file.path, (err) => {
          console.log(err);
        });
      }
    }
    res.status(error.code || 500);
    return res.json({ message: error.message || "An unknown error occurred!" });
  });

  await mongoose.connect(process.env.MONGODB_URL as string);

  app.listen(parseInt(process.env.PORT as string), () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
