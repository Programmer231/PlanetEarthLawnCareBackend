"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const isAuth = ({ context }, next) => {
    if (!context.req.session.employee) {
        throw new Error("not authorized");
    }
    return next();
};
exports.isAuth = isAuth;
