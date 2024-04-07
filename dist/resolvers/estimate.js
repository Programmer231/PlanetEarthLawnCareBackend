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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateResolver = void 0;
const type_graphql_1 = require("type-graphql");
const __1 = require("..");
const AdminUser_1 = require("../entities/AdminUser");
const AvailableJobs_1 = require("../entities/AvailableJobs");
const Estimates_1 = require("../entities/Estimates");
// @ts-ignore
const mongodb_1 = require("mongodb");
const RegularUser_1 = require("../entities/RegularUser");
const isAuth_1 = require("../middleware/isAuth");
const UserId_1 = require("../entities/UserId");
let EstimateObjects = class EstimateObjects {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], EstimateObjects.prototype, "cost", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], EstimateObjects.prototype, "quantity", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], EstimateObjects.prototype, "_id", void 0);
EstimateObjects = __decorate([
    (0, type_graphql_1.InputType)()
], EstimateObjects);
let Deletion = class Deletion {
};
__decorate([
    (0, type_graphql_1.Field)(() => [ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], Deletion.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], Deletion.prototype, "success", void 0);
Deletion = __decorate([
    (0, type_graphql_1.ObjectType)()
], Deletion);
let EstimateInput = class EstimateInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => [EstimateObjects]),
    __metadata("design:type", Array)
], EstimateInput.prototype, "estimates", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], EstimateInput.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], EstimateInput.prototype, "accepted", void 0);
EstimateInput = __decorate([
    (0, type_graphql_1.InputType)()
], EstimateInput);
let ErrorResponse = class ErrorResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ErrorResponse.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ErrorResponse.prototype, "message", void 0);
ErrorResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ErrorResponse);
let JobResponse = class JobResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [AvailableJobs_1.AvailableJobs], { nullable: true }),
    __metadata("design:type", Array)
], JobResponse.prototype, "jobs", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], JobResponse.prototype, "errors", void 0);
JobResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], JobResponse);
let CreateJobResponse = class CreateJobResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], CreateJobResponse.prototype, "jobs", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], CreateJobResponse.prototype, "errors", void 0);
CreateJobResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CreateJobResponse);
let EstimateResponse = class EstimateResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], EstimateResponse.prototype, "estimateSubmitted", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], EstimateResponse.prototype, "errors", void 0);
EstimateResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], EstimateResponse);
let RetrieveEstimates = class RetrieveEstimates {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Estimates_1.Estimates], { nullable: true }),
    __metadata("design:type", Array)
], RetrieveEstimates.prototype, "estimates", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], RetrieveEstimates.prototype, "errors", void 0);
RetrieveEstimates = __decorate([
    (0, type_graphql_1.ObjectType)()
], RetrieveEstimates);
let RetrieveEstimate = class RetrieveEstimate {
};
__decorate([
    (0, type_graphql_1.Field)(() => Estimates_1.Estimates, { nullable: true }),
    __metadata("design:type", Estimates_1.Estimates)
], RetrieveEstimate.prototype, "estimates", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], RetrieveEstimate.prototype, "errors", void 0);
RetrieveEstimate = __decorate([
    (0, type_graphql_1.ObjectType)()
], RetrieveEstimate);
let EstimateResolver = class EstimateResolver {
    getJobs({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield __1.datasource.manager.findOneBy(AdminUser_1.AdminUser, {
                _id: new mongodb_1.ObjectId(req.session.userId),
            });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "authorization",
                            message: "Not Authorized to access jobs",
                        },
                    ],
                };
            }
            return { jobs: yield __1.datasource.manager.find(AvailableJobs_1.AvailableJobs) };
        });
    }
    addJob(name, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield __1.datasource.manager.findOneBy(AdminUser_1.AdminUser, {
                _id: new mongodb_1.ObjectId(req.session.userId),
            });
            if (!adminUser) {
                return {
                    errors: [
                        {
                            field: "authorization",
                            message: "not authorized",
                        },
                    ],
                };
            }
            const job = new AvailableJobs_1.AvailableJobs();
            job.name = name;
            yield __1.datasource.manager.save(job);
            return { jobs: true };
        });
    }
    createEstimate(estimates, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield __1.datasource.manager.findOneBy(AdminUser_1.AdminUser, {
                _id: new mongodb_1.ObjectId(req.session.userId),
            });
            if (!adminUser) {
                return {
                    errors: [
                        {
                            field: "authorization",
                            message: "not authorized",
                        },
                    ],
                };
            }
            const userEstimate = new Estimates_1.Estimates();
            userEstimate.userId = new UserId_1.UserID();
            userEstimate.userId._id = new mongodb_1.ObjectId(estimates.userId);
            userEstimate.jobs = [];
            userEstimate.accepted = estimates.accepted;
            for (let estimate of estimates.estimates) {
                if (estimate._id == "" || estimate.cost === "") {
                    return {
                        errors: [
                            {
                                field: "User input",
                                message: "Couldn't read information you inputed. Try resetting the form by pressing the X next to the first field.",
                            },
                        ],
                    };
                }
            }
            try {
                let totalCost = 0;
                for (let x = 0; x < estimates.estimates.length; x++) {
                    let jobId = new mongodb_1.ObjectId(estimates.estimates[x]._id);
                    let cost = parseFloat(estimates.estimates[x].cost.split("$").join(""));
                    let quantity = estimates.estimates[x].quantity;
                    totalCost += cost * quantity;
                    const specificJob = yield __1.datasource.manager.findOne(AvailableJobs_1.AvailableJobs, {
                        where: { _id: jobId },
                    });
                    if (!specificJob) {
                        return {
                            errors: [
                                {
                                    field: "Error",
                                    message: "Unkown Error Occurred",
                                },
                            ],
                        };
                    }
                    userEstimate.jobs.push({
                        _id: jobId,
                        cost: cost,
                        quantity: quantity,
                        name: specificJob.name,
                    });
                }
                const user = yield __1.datasource.manager.findOneBy(RegularUser_1.RegularUser, {
                    _id: new mongodb_1.ObjectId(estimates.userId),
                });
                userEstimate.name = user === null || user === void 0 ? void 0 : user.name;
                userEstimate.address = user === null || user === void 0 ? void 0 : user.address;
                userEstimate.totalCost = parseFloat(totalCost.toFixed(2));
                yield __1.datasource.manager.save(userEstimate);
            }
            catch (err) {
                console.log("unsuccessful");
                console.log(err);
            }
            return { estimateSubmitted: true };
        });
    }
    getJobsToEstimate(jobId, date, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield __1.datasource.manager.findOneBy(AdminUser_1.AdminUser, {
                _id: new mongodb_1.ObjectId(req.session.userId),
            });
            if (!adminUser) {
                return {
                    errors: [
                        {
                            field: "authorization",
                            message: "not authorized",
                        },
                    ],
                };
            }
            const searchJob = yield __1.datasource.manager.findOne(AvailableJobs_1.AvailableJobs, {
                where: { _id: new mongodb_1.ObjectId(jobId) },
            });
            const realDate = new Date(date);
            console.log(realDate);
            const startofMonth = new Date(realDate.getFullYear(), realDate.getMonth(), 1);
            const startofNextMonth = new Date(realDate.getFullYear(), realDate.getMonth() + 1, 1);
            const estimates = yield __1.datasource.manager.findBy(Estimates_1.Estimates, {
                where: {
                    "jobs._id": { $eq: searchJob === null || searchJob === void 0 ? void 0 : searchJob._id },
                    createdAt: {
                        $gte: startofMonth,
                        $lt: startofNextMonth,
                    },
                    accepted: true,
                },
                order: {
                    updatedAt: "DESC",
                },
            });
            return { estimates: estimates };
        });
    }
    getAllEstimatesQuery({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const estimates = yield __1.datasource.manager.findBy(Estimates_1.Estimates, {
                    order: {
                        updatedAt: "DESC",
                    },
                });
                return { estimates: estimates };
            }
            catch (_a) {
                return {
                    errors: [
                        {
                            field: "Estimate Retrieval Failed",
                            message: "Database Failed to Load Estimates",
                        },
                    ],
                };
            }
        });
    }
    getAllEstimates(date, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const realDate = new Date(date);
            const startofMonth = new Date(realDate.getFullYear(), realDate.getMonth(), 1);
            const startofNextMonth = new Date(realDate.getFullYear(), realDate.getMonth() + 1, 1);
            const estimates = yield __1.datasource.manager.findBy(Estimates_1.Estimates, {
                where: {
                    accepted: true,
                    updatedAt: {
                        $gte: startofMonth,
                        $lt: startofNextMonth,
                    },
                },
                order: {
                    updatedAt: "DESC",
                },
            });
            return { estimates: estimates };
        });
    }
    getUsersToEstimates(date, inputUserId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield __1.datasource.manager.findOneBy(AdminUser_1.AdminUser, {
                _id: new mongodb_1.ObjectId(req.session.userId),
            });
            if (!adminUser) {
                return {
                    errors: [
                        {
                            field: "authorization",
                            message: "not authorized",
                        },
                    ],
                };
            }
            const realDate = new Date(date);
            const startofMonth = new Date(realDate.getFullYear(), realDate.getMonth(), 1);
            const startofNextMonth = new Date(realDate.getFullYear(), realDate.getMonth() + 1, 1);
            const estimates = yield __1.datasource.manager.findBy(Estimates_1.Estimates, {
                where: {
                    accepted: true,
                    "userId._id": new mongodb_1.ObjectId(inputUserId),
                    updatedAt: {
                        $gte: startofMonth,
                        $lt: startofNextMonth,
                    },
                },
                order: {
                    updatedAt: "DESC",
                },
            });
            return { estimates: estimates };
        });
    }
    getSpecificEstimate(estimateId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield __1.datasource.manager.findOneBy(AdminUser_1.AdminUser, {
                _id: new mongodb_1.ObjectId(req.session.userId),
            });
            if (!adminUser) {
                return {
                    errors: [
                        {
                            field: "authorization",
                            message: "not authorized",
                        },
                    ],
                };
            }
            const specificEstimate = yield __1.datasource.manager.findOne(Estimates_1.Estimates, {
                where: {
                    _id: new mongodb_1.ObjectId(estimateId),
                },
            });
            if (!specificEstimate) {
                return {
                    errors: [
                        { field: "Estimate Not Found", message: "Estimate Not Found" },
                    ],
                };
            }
            return { estimates: specificEstimate };
        });
    }
    updateSpecificEstimate(estimates, estimateId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const estimate = yield __1.datasource.manager.findOne(Estimates_1.Estimates, {
                where: { _id: new mongodb_1.ObjectId(estimateId) },
            });
            if (!estimate) {
                return {
                    errors: [
                        {
                            field: "Estimate",
                            message: "Estimate not found",
                        },
                    ],
                };
            }
            estimate.userId._id = new mongodb_1.ObjectId(estimates.userId);
            estimate.jobs = [];
            estimate.accepted = estimates.accepted;
            for (let estimate of estimates.estimates) {
                if (estimate._id == "" || estimate.cost === "") {
                    return {
                        errors: [
                            {
                                field: "User input",
                                message: "Couldn't read information you inputed. Try resetting the form by pressing the X next to the first field.",
                            },
                        ],
                    };
                }
            }
            try {
                let totalCost = 0;
                for (let x = 0; x < estimates.estimates.length; x++) {
                    let jobId = new mongodb_1.ObjectId(estimates.estimates[x]._id);
                    let cost = parseFloat(estimates.estimates[x].cost.split("$").join(""));
                    let quantity = estimates.estimates[x].quantity;
                    totalCost += cost * quantity;
                    const specificJob = yield __1.datasource.manager.findOne(AvailableJobs_1.AvailableJobs, {
                        where: { _id: jobId },
                    });
                    if (!specificJob) {
                        return {
                            errors: [
                                {
                                    field: "Error",
                                    message: "Unkown Error Occurred",
                                },
                            ],
                        };
                    }
                    estimate.jobs.push({
                        _id: jobId,
                        cost: cost,
                        quantity: quantity,
                        name: specificJob.name,
                    });
                }
                const user = yield __1.datasource.manager.findOneBy(RegularUser_1.RegularUser, {
                    _id: new mongodb_1.ObjectId(estimates.userId),
                });
                estimate.name = user === null || user === void 0 ? void 0 : user.name;
                estimate.address = user === null || user === void 0 ? void 0 : user.address;
                estimate.totalCost = parseFloat(totalCost.toFixed(2));
                yield __1.datasource.manager.save(estimate);
            }
            catch (err) {
                console.log("unsuccessful");
                console.log(err);
                throw new Error(err);
            }
            return { estimateSubmitted: true };
        });
    }
    deleteEstimate({ req, res }, id) {
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
            const estimate = yield __1.datasource.manager.delete(Estimates_1.Estimates, new mongodb_1.ObjectId(id));
            return { success: true };
        });
    }
    deleteJob({ req, res }, id) {
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
            const estimate = yield __1.datasource.manager.delete(AvailableJobs_1.AvailableJobs, new mongodb_1.ObjectId(id));
            return { success: true };
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => JobResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EstimateResolver.prototype, "getJobs", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CreateJobResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("name", () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EstimateResolver.prototype, "addJob", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => EstimateResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("estimates", () => EstimateInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EstimateInput, Object]),
    __metadata("design:returntype", Promise)
], EstimateResolver.prototype, "createEstimate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => RetrieveEstimates),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("jobId", () => String)),
    __param(1, (0, type_graphql_1.Arg)("date", () => String)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], EstimateResolver.prototype, "getJobsToEstimate", null);
__decorate([
    (0, type_graphql_1.Query)(() => RetrieveEstimates),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EstimateResolver.prototype, "getAllEstimatesQuery", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => RetrieveEstimates),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("date", () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EstimateResolver.prototype, "getAllEstimates", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => RetrieveEstimates),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("date", () => String)),
    __param(1, (0, type_graphql_1.Arg)("inputUserId", () => String)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], EstimateResolver.prototype, "getUsersToEstimates", null);
__decorate([
    (0, type_graphql_1.Query)(() => RetrieveEstimate),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("estimateId", () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EstimateResolver.prototype, "getSpecificEstimate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => EstimateResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("estimates", () => EstimateInput)),
    __param(1, (0, type_graphql_1.Arg)("estimateId", () => String)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EstimateInput, String, Object]),
    __metadata("design:returntype", Promise)
], EstimateResolver.prototype, "updateSpecificEstimate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Deletion),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EstimateResolver.prototype, "deleteEstimate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Deletion),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EstimateResolver.prototype, "deleteJob", null);
EstimateResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], EstimateResolver);
exports.EstimateResolver = EstimateResolver;
