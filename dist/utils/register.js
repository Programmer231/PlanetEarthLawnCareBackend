"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (email, username, password) => {
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
    if (password.length < 8) {
        return [
            {
                field: "password",
                message: "password not long enough. It must be at least 8 characters.",
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
