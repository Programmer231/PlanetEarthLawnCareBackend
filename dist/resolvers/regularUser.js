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
exports.RegularUserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const __1 = require("..");
const RegularUser_1 = require("../entities/RegularUser");
// @ts-ignore
const mongodb_1 = require("mongodb");
const isCustomer_1 = require("../middleware/isCustomer");
const argon2_1 = __importDefault(require("argon2"));
const register_1 = require("../utils/register");
const sendEmail_1 = require("../utils/sendEmail");
const constants_1 = require("../constants");
const uuid_1 = require("uuid");
let regularUserStatusResponse = class regularUserStatusResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], regularUserStatusResponse.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [SecondErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], regularUserStatusResponse.prototype, "errors", void 0);
regularUserStatusResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], regularUserStatusResponse);
let SecondErrorResponse = class SecondErrorResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], SecondErrorResponse.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], SecondErrorResponse.prototype, "message", void 0);
SecondErrorResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], SecondErrorResponse);
let RegularUserResolver = class RegularUserResolver {
    createUser(name, phoneNumber, address, password, email, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = (0, register_1.validateRegister)(email, name, password);
            if (response) {
                return { errors: response };
            }
            const newUser = new RegularUser_1.RegularUser();
            newUser.name = name;
            newUser.address = address;
            newUser.phoneNumber = phoneNumber;
            const hashedPassword = yield argon2_1.default.hash(password);
            newUser.password = hashedPassword;
            newUser.email = email;
            try {
                let user = yield __1.datasource.manager.save(newUser);
                if (!req.session.admin) {
                    req.session.userId = user._id.toString();
                    req.session.admin = false;
                    req.session.customer = true;
                    req.session.employee = false;
                }
            }
            catch (error) {
                if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
                    return {
                        errors: [
                            {
                                field: "Duplicate Address or Phone Number or Email",
                                message: "Someone else in this database already has this address, phone number, or email. Please make a new estimate under their name.",
                            },
                        ],
                    };
                }
                else {
                    return {
                        errors: [
                            {
                                field: "Unkown Error",
                                message: "An Unkown Error Occurred",
                            },
                        ],
                    };
                }
            }
            return { user: true };
        });
    }
    loginRegularUser({ req, res }, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield __1.datasource.manager.findOneBy(RegularUser_1.RegularUser, {
                email: email,
            });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "email",
                            message: "email doesn't exist",
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
            req.session.admin = false;
            req.session.customer = true;
            req.session.employee = false;
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
    getUser({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId || !req.session.customer) {
                return null;
            }
            const user = yield __1.datasource.manager.findOneBy(RegularUser_1.RegularUser, {
                _id: new mongodb_1.ObjectId(req.session.userId),
            });
            if (user) {
                user._id = user === null || user === void 0 ? void 0 : user._id.toString();
            }
            return user;
        });
    }
    sendUserEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield __1.datasource.manager.findOneBy(RegularUser_1.RegularUser, {
                email: email,
            });
            if (!user) {
                return true;
            }
            const token = (0, uuid_1.v4)().toString();
            user.forgotpassword = token;
            yield __1.datasource.manager.save(user);
            yield (0, sendEmail_1.sendEmail)(user.email, `<a href="http://${constants_1._prod_ ? ".planetearthlawncare.org" : "localhost:3000"}/create-password/${token}">Reset Password</a>`);
            return true;
        });
    }
    forgotUserPassword(newPassword, token, { req }) {
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
            const user = yield __1.datasource.manager.findOneBy(RegularUser_1.RegularUser, {
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
};
__decorate([
    (0, type_graphql_1.Mutation)(() => regularUserStatusResponse),
    __param(0, (0, type_graphql_1.Arg)("name", () => String)),
    __param(1, (0, type_graphql_1.Arg)("phoneNumber", () => String)),
    __param(2, (0, type_graphql_1.Arg)("address", () => String)),
    __param(3, (0, type_graphql_1.Arg)("password", () => String)),
    __param(4, (0, type_graphql_1.Arg)("email", () => String)),
    __param(5, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RegularUserResolver.prototype, "createUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => regularUserStatusResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("email", () => String)),
    __param(2, (0, type_graphql_1.Arg)("password", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], RegularUserResolver.prototype, "loginRegularUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isCustomer_1.isCustomer),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegularUserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Query)(() => RegularUser_1.RegularUser, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegularUserResolver.prototype, "getUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("email", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RegularUserResolver.prototype, "sendUserEmail", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => regularUserStatusResponse),
    __param(0, (0, type_graphql_1.Arg)("newPassword", () => String)),
    __param(1, (0, type_graphql_1.Arg)("token", () => String)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RegularUserResolver.prototype, "forgotUserPassword", null);
RegularUserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RegularUserResolver);
exports.RegularUserResolver = RegularUserResolver;
