"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (email, password, username) => {
    if (!email.includes("@")) {
        return [{ field: "email", message: "invalid email" }];
    }
    if (username.includes("@")) {
        return [{ field: "username", message: "cannot include @ sign" }];
    }
    if (username.length <= 2) {
        return [
            {
                field: "username",
                message: "username not long enough",
            },
        ];
    }
    if (password.length <= 3) {
        return [
            {
                field: "password",
                message: "password not long enough",
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
