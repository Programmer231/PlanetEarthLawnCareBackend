import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

export const isCustomer: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("not authenticated");
  }

  return next();
};
