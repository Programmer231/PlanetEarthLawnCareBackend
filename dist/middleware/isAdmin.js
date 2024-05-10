"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = ({ context }, next) => {
    if (!context.req.session.admin) {
        throw new Error("not authorized");
    }
    return next();
};
exports.isAdmin = isAdmin;
