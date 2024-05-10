"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCustomer = void 0;
const isCustomer = ({ context }, next) => {
    if (!context.req.session.userId) {
        throw new Error("not authenticated");
    }
    return next();
};
exports.isCustomer = isCustomer;
