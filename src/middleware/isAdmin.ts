import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

export const isAdmin: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.admin) {
    throw new Error("not authorized");
  }

  return next();
};
