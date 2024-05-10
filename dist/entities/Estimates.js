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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estimates = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Job_1 = require("./Job");
// @ts-ignore
const mongodb_1 = require("mongodb");
const UserId_1 = require("./UserId");
let Estimates = class Estimates {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], Estimates.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Estimates.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Estimates.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Job_1.Job]),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Array)
], Estimates.prototype, "jobs", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => UserId_1.UserID),
    (0, typeorm_1.Column)(),
    __metadata("design:type", UserId_1.UserID)
], Estimates.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Estimates.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Estimates.prototype, "address", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Estimates.prototype, "accepted", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Estimates.prototype, "totalCost", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Array)
], Estimates.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Estimates.prototype, "checked", void 0);
Estimates = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Estimates);
exports.Estimates = Estimates;
