import HttpError from "../models/http-error";

const middleware = (req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log("Skipping");
    return next();
  }

  if (req.session && req.session.userId && req.session.admin) {
    next();
  } else {
    const error = new HttpError("Authentication failed! Please login!", 401);
    return next(error);
  }
};

export default middleware;
