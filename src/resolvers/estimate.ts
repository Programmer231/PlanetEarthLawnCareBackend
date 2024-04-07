import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { datasource } from "..";
import { AdminUser } from "../entities/AdminUser";
import { AvailableJobs } from "../entities/AvailableJobs";
import { Estimates } from "../entities/Estimates";
import { Job } from "../entities/Job";
import { MyContext } from "../types";
// @ts-ignore
import { ObjectId } from "mongodb";
import { RegularUser } from "../entities/RegularUser";
import { isCustomer } from "../middleware/isCustomer";
import { isAdmin } from "../middleware/isAdmin";
import { UserID } from "../entities/UserId";
import fs from "fs";
import path from "path";

@InputType()
class EstimateObjects {
  @Field(() => String)
  cost!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => String)
  _id!: string;
}

@ObjectType()
class Deletion {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];

  @Field(() => Boolean, { nullable: true })
  success?: Boolean;
}

@InputType()
class EstimateInput {
  @Field(() => [EstimateObjects])
  estimates!: EstimateObjects[];

  @Field(() => String)
  userId!: ObjectId;

  @Field(() => Boolean)
  accepted!: boolean;
}

@ObjectType()
class ErrorResponse {
  @Field(() => String)
  field!: string;

  @Field(() => String)
  message!: string;
}

@ObjectType()
class JobResponse {
  @Field(() => [AvailableJobs], { nullable: true })
  jobs?: AvailableJobs[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
class CreateJobResponse {
  @Field(() => Boolean, { nullable: true })
  jobs?: Boolean;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
class EstimateResponse {
  @Field(() => Boolean, { nullable: true })
  estimateSubmitted?: Boolean;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
class RetrieveEstimates {
  @Field(() => [Estimates], { nullable: true })
  estimates?: Estimates[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
class RetrieveEstimate {
  @Field(() => Estimates, { nullable: true })
  estimates?: Estimates;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@Resolver()
export class EstimateResolver {
  @Query(() => JobResponse)
  async getJobs(@Ctx() { req }: MyContext): Promise<JobResponse> {
    return { jobs: await datasource.manager.find(AvailableJobs) };
  }

  @Mutation(() => CreateJobResponse)
  @UseMiddleware(isAdmin)
  async addJob(
    @Arg("name", () => String) name: string,
    @Ctx() { req }: MyContext
  ): Promise<CreateJobResponse> {
    const adminUser = await datasource.manager.findOneBy(AdminUser, {
      _id: new ObjectId(req.session.userId),
    } as any);

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

    const job = new AvailableJobs();

    job.name = name;

    await datasource.manager.save(job);

    return { jobs: true };
  }
  @Mutation(() => EstimateResponse)
  @UseMiddleware(isAdmin)
  async createEstimate(
    @Arg("estimates", () => EstimateInput) estimates: EstimateInput,
    @Ctx() { req }: MyContext
  ): Promise<EstimateResponse> {
    const adminUser = await datasource.manager.findOneBy(AdminUser, {
      _id: new ObjectId(req.session.userId),
    } as any);

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

    const userEstimate = new Estimates();
    userEstimate.userId = new UserID();
    userEstimate.userId._id = new ObjectId(estimates.userId);
    userEstimate.jobs = [];

    userEstimate.accepted = estimates.accepted;

    for (let estimate of estimates.estimates) {
      if (estimate._id == "" || estimate.cost === "") {
        return {
          errors: [
            {
              field: "User input",
              message:
                "Couldn't read information you inputed. Try resetting the form by pressing the X next to the first field.",
            },
          ],
        };
      }
    }

    try {
      let totalCost = 0;
      for (let x = 0; x < estimates.estimates.length; x++) {
        let jobId = new ObjectId(estimates.estimates[x]._id);
        let cost = parseFloat(estimates.estimates[x].cost.split("$").join(""));
        let quantity = estimates.estimates[x].quantity;

        totalCost += cost * quantity;

        const specificJob = await datasource.manager.findOne(AvailableJobs, {
          where: { _id: jobId },
        } as any);

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
          name: specificJob.name as string,
        });
      }

      const user = await datasource.manager.findOneBy(RegularUser, {
        _id: new ObjectId(estimates.userId),
      } as any);

      userEstimate.name = user?.name as string;

      userEstimate.address = user?.address as string;
      userEstimate.totalCost = parseFloat(totalCost.toFixed(2));

      await datasource.manager.save(userEstimate);
    } catch (err: any) {
      console.log("unsuccessful");
      console.log(err);
    }

    return { estimateSubmitted: true };
  }

  @Mutation(() => RetrieveEstimates)
  @UseMiddleware(isAdmin)
  async getJobsToEstimate(
    @Arg("jobId", () => String) jobId: string,
    @Arg("date", () => String) date: string,
    @Ctx() { req }: MyContext
  ): Promise<RetrieveEstimates> {
    const adminUser = await datasource.manager.findOneBy(AdminUser, {
      _id: new ObjectId(req.session.userId),
    } as any);

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

    const searchJob = await datasource.manager.findOne(AvailableJobs, {
      where: { _id: new ObjectId(jobId) } as any,
    });

    const realDate = new Date(date);

    const startofMonth = new Date(
      realDate.getFullYear(),
      realDate.getMonth(),
      1
    );
    const startofNextMonth = new Date(
      realDate.getFullYear(),
      realDate.getMonth() + 1,
      1
    );

    const estimates = await datasource.manager.findBy(Estimates, {
      where: {
        "jobs._id": { $eq: searchJob?._id },
        updatedAt: {
          $gte: startofMonth,
          $lt: startofNextMonth,
        },
        accepted: true,
      },

      order: {
        updatedAt: "DESC",
      },
    } as any);

    return { estimates: estimates };
  }

  @Query(() => RetrieveEstimates)
  @UseMiddleware(isAdmin)
  async getAllEstimatesQuery(
    @Ctx() { req }: MyContext
  ): Promise<RetrieveEstimates> {
    try {
      const estimates = await datasource.manager.findBy(Estimates, {
        order: {
          updatedAt: "DESC",
        },
      } as any);

      return { estimates: estimates };
    } catch {
      return {
        errors: [
          {
            field: "Estimate Retrieval Failed",
            message: "Database Failed to Load Estimates",
          },
        ],
      };
    }
  }

  @Mutation(() => RetrieveEstimates)
  @UseMiddleware(isAdmin)
  async getAllEstimates(
    @Arg("date", () => String) date: string,
    @Ctx() { req }: MyContext
  ) {
    const realDate = new Date(date);

    const startofMonth = new Date(
      realDate.getFullYear(),
      realDate.getMonth(),
      1
    );
    const startofNextMonth = new Date(
      realDate.getFullYear(),
      realDate.getMonth() + 1,
      1
    );

    const estimates = await datasource.manager.findBy(Estimates, {
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
    } as any);

    return { estimates: estimates };
  }

  @Mutation(() => RetrieveEstimates)
  @UseMiddleware(isAdmin)
  async getUsersToEstimates(
    @Arg("date", () => String) date: string,
    @Arg("inputUserId", () => String) inputUserId: string,
    @Ctx() { req }: MyContext
  ) {
    const realDate = new Date(date);

    const startofMonth = new Date(
      realDate.getFullYear(),
      realDate.getMonth(),
      1
    );
    const startofNextMonth = new Date(
      realDate.getFullYear(),
      realDate.getMonth() + 1,
      1
    );

    const estimates = await datasource.manager.findBy(Estimates, {
      where: {
        accepted: true,

        "userId._id": new ObjectId(inputUserId),
        updatedAt: {
          $gte: startofMonth,
          $lt: startofNextMonth,
        },
      },

      order: {
        updatedAt: "DESC",
      },
    } as any);

    return { estimates: estimates };
  }

  @Query(() => RetrieveEstimate)
  @UseMiddleware(isAdmin)
  async getSpecificEstimate(
    @Arg("estimateId", () => String) estimateId: string,
    @Ctx() { req }: MyContext
  ): Promise<RetrieveEstimate> {
    const specificEstimate = await datasource.manager.findOne(Estimates, {
      where: {
        _id: new ObjectId(estimateId),
      } as any,
    });

    if (!specificEstimate) {
      return {
        errors: [
          { field: "Estimate Not Found", message: "Estimate Not Found" },
        ],
      };
    }

    return { estimates: specificEstimate };
  }

  @Mutation(() => EstimateResponse)
  @UseMiddleware(isAdmin)
  async updateSpecificEstimate(
    @Arg("estimates", () => EstimateInput) estimates: EstimateInput,
    @Arg("estimateId", () => String) estimateId: string,
    @Ctx() { req }: MyContext
  ): Promise<EstimateResponse> {
    const estimate = await datasource.manager.findOne(Estimates, {
      where: { _id: new ObjectId(estimateId) } as any,
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
    estimate.userId._id = new ObjectId(estimates.userId);

    estimate.jobs = [];

    estimate.accepted = estimates.accepted;

    for (let estimate of estimates.estimates) {
      if (estimate._id == "" || estimate.cost === "") {
        return {
          errors: [
            {
              field: "User input",
              message:
                "Couldn't read information you inputed. Try resetting the form by pressing the X next to the first field.",
            },
          ],
        };
      }
    }

    try {
      let totalCost = 0;
      for (let x = 0; x < estimates.estimates.length; x++) {
        let jobId = new ObjectId(estimates.estimates[x]._id);
        let cost = parseFloat(estimates.estimates[x].cost.split("$").join(""));
        let quantity = estimates.estimates[x].quantity;

        totalCost += cost * quantity;

        const specificJob = await datasource.manager.findOne(AvailableJobs, {
          where: { _id: jobId },
        } as any);

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
          name: specificJob.name as string,
        });
      }

      const user = await datasource.manager.findOneBy(RegularUser, {
        _id: new ObjectId(estimates.userId),
      } as any);

      estimate.name = user?.name as string;

      estimate.address = user?.address as string;
      estimate.totalCost = parseFloat(totalCost.toFixed(2));

      await datasource.manager.save(estimate);
    } catch (err: any) {
      console.log("unsuccessful");
      console.log(err);
      throw new Error(err);
    }
    return { estimateSubmitted: true };
  }

  @Mutation(() => Deletion)
  @UseMiddleware(isAdmin)
  async deleteEstimate(
    @Ctx() { req, res }: MyContext,
    @Arg("id", () => String) id: string
  ): Promise<Deletion> {
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
    const estimate = await datasource.manager.delete(
      Estimates,
      new ObjectId(id)
    );

    return { success: true };
  }

  @Mutation(() => Deletion)
  @UseMiddleware(isAdmin)
  async deleteJob(
    @Ctx() { req, res }: MyContext,
    @Arg("id", () => String) id: string
  ): Promise<Deletion> {
    const job = await datasource.manager.findOne(AvailableJobs, {
      where: { _id: new ObjectId(id) },
    });

    await datasource.manager.delete(AvailableJobs, new ObjectId(id));

    for (let file of (job as any).images) {
      fs.unlink(path.join(__dirname, "../", file), (err) => {
        console.log(err);
      });
    }

    return { success: true };
  }
}
