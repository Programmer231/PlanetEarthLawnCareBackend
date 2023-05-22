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
exports.Job = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const AvailableJobs_1 = require("./AvailableJobs");
// @ts-ignore
const mongodb_1 = require("mongodb");
let Job = class Job {
};
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Job.prototype, "cost", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Job.prototype, "quantity", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.ObjectIdColumn)(),
    (0, typeorm_1.Column)((type) => AvailableJobs_1.AvailableJobs),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], Job.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Job.prototype, "name", void 0);
Job = __decorate([
    (0, type_graphql_1.ObjectType)()
], Job);
exports.Job = Job;
