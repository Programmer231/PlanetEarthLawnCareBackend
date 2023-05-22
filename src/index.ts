import "reflect-metadata";
import { COOKIE_NAME, _prod_ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import session from "express-session";
import { MyContext } from "./types";
import mongoSession from "connect-mongodb-session";
import cors from "cors";
import { DataSource } from "typeorm";
import path from "path";
import { UserResolver } from "./resolvers/user";
import { Estimates } from "./entities/Estimates";
import { AdminUser } from "./entities/AdminUser";
import { RegularUser } from "./entities/RegularUser";
import { EstimateResolver } from "./resolvers/estimate";
import { AvailableJobs } from "./entities/AvailableJobs";
import { RegularUserResolver } from "./resolvers/regularUser";
require("dotenv").config();
declare module "express-session" {
  interface Session {
    userId?: string;
    admin?: boolean;
    employee?: boolean;
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

  const store = new mongoDbStore({
    uri: process.env.MONGODB_URL as string,
    collection: "sessions",
  });

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
        secure: _prod_,
        domain: _prod_ ? ".planetearthlawncare.org" : undefined,
        httpOnly: true,
      },
      resave: false,
      saveUninitialized: false,
      secret: process.env.AUTHENTICATION_KEY as string,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, EstimateResolver, RegularUserResolver],
      validate: false,
    }),
    context: ({ req, res }: MyContext) => ({ req, res }),
    csrfPrevention: true,
    cache: "bounded",
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
