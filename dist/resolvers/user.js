"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const AdminUser_1 = require("../entities/AdminUser");
const register_1 = require("../utils/register");
const constants_1 = require("../constants");
const uuid_1 = require("uuid");
const sendEmail_1 = require("../utils/sendEmail");
const __1 = require("..");
// @ts-ignore
const mongodb_1 = require("mongodb");
const isAdmin_1 = require("../middleware/isAdmin");
const RegularUser_1 = require("../entities/RegularUser");
let RegularUserResponse = class RegularUserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [RegularUser_1.RegularUser], { nullable: true }),
    __metadata("design:type", Array)
], RegularUserResponse.prototype, "users", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], RegularUserResponse.prototype, "errors", void 0);
RegularUserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], RegularUserResponse);
let DeleteUser = class DeleteUser {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], DeleteUser.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], DeleteUser.prototype, "success", void 0);
DeleteUser = __decorate([
    (0, type_graphql_1.ObjectType)()
], DeleteUser);
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId || !req.session.admin) {
                return null;
            }
            const user = yield __1.datasource.manager.findOneBy(AdminUser_1.AdminUser, {
                _id: new mongodb_1.ObjectId(req.session.userId),
            });
            if (!user) {
                return null;
            }
            if (user) {
                user._id = user === null || user === void 0 ? void 0 : user._id.toString();
            }
            return user;
        });
    }
    register(email, username, password, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = (0, register_1.validateRegister)(email, username, password);
            if (response) {
                return { errors: response };
            }
            const hashedPassword = yield argon2_1.default.hash(password);
            try {
                const user = new AdminUser_1.AdminUser();
                user.username = username;
                user.password = hashedPassword;
                user.email = email;
                yield __1.datasource.manager.save(user);
                req.session.userId = user._id.toString();
                return { user: true };
            }
            catch (err) {
                if (err.detail.includes("already exists")) {
                    return {
                        errors: [
                            {
                                field: "email",
                                message: "User Already Exists",
                            },
                        ],
                    };
                }
            }
            return { errors: [{ field: "Error", message: "Unknown Error" }] };
        });
    }
    login(usernameOrEmail, password, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield __1.datasource.manager.findOneBy(AdminUser_1.AdminUser, usernameOrEmail.includes("@")
                ? { email: usernameOrEmail }
                : { username: usernameOrEmail });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "usernameOrEmail",
                            message: "username or email doesn't exist",
                        },
                    ],
                };
            }
            const valid = yield argon2_1.default.verify(user.password, password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "incorrect password",
                        },
                    ],
                };
            }
            //store user id session
            //this will set a cookie on the user
            //keep them logged in
            req.session.userId = user._id.toString();
            req.session.admin = true;
            req.session.customer = false;
            req.session.employee = false;
            return { user: true };
        });
    }
    sendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield __1.datasource.manager.findOneBy(AdminUser_1.AdminUser, {
                email: email,
            });
            if (!user) {
                return true;
            }
            const token = (0, uuid_1.v4)().toString();
            user.forgotpassword = token;
            yield __1.datasource.manager.save(user);
            yield (0, sendEmail_1.sendEmail)(user.email, `<a href="http://${constants_1._prod_ ? ".planetearthlawncare.org" : "localhost:3000"}/create-password/${token}">Reset Password</a>`).catch((err) => console.log(err));
            return true;
        });
    }
    forgotPassword(newPassword, token, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newPassword.length <= 2) {
                return {
                    errors: [
                        {
                            field: "newPassword",
                            message: "length must be greater than 2",
                        },
                    ],
                };
            }
            const user = yield __1.datasource.manager.findOneBy(AdminUser_1.AdminUser, {
                forgotpassword: token,
            });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "User",
                            message: "User not found. Please make sure you click the exact link you were sent in your email and try again.",
                        },
                    ],
                };
            }
            const password = yield argon2_1.default.hash(newPassword);
            user.password = password;
            user.forgotpassword = null;
            yield __1.datasource.manager.save(user);
            req.session.userId = user._id.toString();
            req.session.admin = false;
            return { user: true };
        });
    }
    logout({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                req.session.destroy((err) => {
                    res.clearCookie(process.env.COOKIENAME);
                    if (err) {
                        console.log(err);
                        resolve(false);
                    }
                    resolve(true);
                });
            });
        });
    }
    getUsers({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return {
                    errors: [
                        {
                            field: "authentication",
                            message: "User not authenticated",
                        },
                    ],
                };
            }
            // if (!req.session.admin) {
            //   return {
            //     errors: [
            //       {
            //         field: "authorization",
            //         message: "User not authorized",
            //       },
            //     ],
            //   };
            // }
            return { users: yield __1.datasource.manager.find(RegularUser_1.RegularUser) };
        });
    }
    deleteUser({ req, res }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return {
                    errors: [
                        {
                            field: "authentication",
                            message: "User not authenticated",
                        },
                    ],
                };
            }
            const user = yield __1.datasource.manager.delete(RegularUser_1.RegularUser, new mongodb_1.ObjectId(id));
            return { success: true };
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => AdminUser_1.AdminUser, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    (0, type_graphql_1.UseMiddleware)(isAdmin_1.isAdmin),
    __param(0, (0, type_graphql_1.Arg)("email", () => String)),
    __param(1, (0, type_graphql_1.Arg)("username", () => String)),
    __param(2, (0, type_graphql_1.Arg)("password", () => String)),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("usernameOrEmail", () => String)),
    __param(1, (0, type_graphql_1.Arg)("password", () => String)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("email", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "sendEmail", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("newPassword", () => String)),
    __param(1, (0, type_graphql_1.Arg)("token", () => String)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Query)(() => RegularUserResponse),
    (0, type_graphql_1.UseMiddleware)(isAdmin_1.isAdmin),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => DeleteUser),
    (0, type_graphql_1.UseMiddleware)(isAdmin_1.isAdmin),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
