"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmployee = void 0;
const isEmployee = ({ context }, next) => {
    if (!context.req.session.employee) {
        throw new Error("not authorized");
    }
    return next();
};
exports.isEmployee = isEmployee;
