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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegularUserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const __1 = require("..");
const AdminUser_1 = require("../entities/AdminUser");
const RegularUser_1 = require("../entities/RegularUser");
// @ts-ignore
const mongodb_1 = require("mongodb");
const isAuth_1 = require("../middleware/isAuth");
let RegularUserResponse = class RegularUserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [RegularUser_1.RegularUser], { nullable: true }),
    __metadata("design:type", Array)
], RegularUserResponse.prototype, "users", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [SecondErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], RegularUserResponse.prototype, "errors", void 0);
RegularUserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], RegularUserResponse);
let CreateRegularUserResponse = class CreateRegularUserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], CreateRegularUserResponse.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [SecondErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], CreateRegularUserResponse.prototype, "errors", void 0);
CreateRegularUserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CreateRegularUserResponse);
let DeleteUser = class DeleteUser {
};
__decorate([
    (0, type_graphql_1.Field)(() => [SecondErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], DeleteUser.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], DeleteUser.prototype, "success", void 0);
DeleteUser = __decorate([
    (0, type_graphql_1.ObjectType)()
], DeleteUser);
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
    createUser(name, phoneNumber, address, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedInUser = yield __1.datasource.manager.findOneBy(AdminUser_1.AdminUser, {
                _id: new mongodb_1.ObjectId(req.session.userId),
            });
            if (!loggedInUser) {
                return {
                    errors: [
                        {
                            field: "authorization",
                            message: "not authorized to perform this action",
                        },
                    ],
                };
            }
            const newUser = new RegularUser_1.RegularUser();
            newUser.name = name;
            newUser.address = address;
            newUser.phoneNumber = phoneNumber;
            try {
                yield __1.datasource.manager.save(newUser);
            }
            catch (error) {
                if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
                    return {
                        errors: [
                            {
                                field: "Duplicate Address or Phone Number",
                                message: "Someone else in this database already has this address or phone number, please make a new estimate under their name.",
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
    (0, type_graphql_1.Mutation)(() => CreateRegularUserResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("name", () => String)),
    __param(1, (0, type_graphql_1.Arg)("phoneNumber", () => String)),
    __param(2, (0, type_graphql_1.Arg)("address", () => String)),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RegularUserResolver.prototype, "createUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => RegularUserResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegularUserResolver.prototype, "getUsers", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => DeleteUser),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RegularUserResolver.prototype, "deleteUser", null);
RegularUserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RegularUserResolver);
exports.RegularUserResolver = RegularUserResolver;
