import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

export const isEmployee: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.employee) {
    throw new Error("not authorized");
  }

  return next();
};
