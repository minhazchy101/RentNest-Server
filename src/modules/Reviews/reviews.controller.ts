import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utilities/catchAsync";
import { sendRes } from "../../utilities/sendResponse";
import { reviewService } from "./reviews.service";

const {
  createReviewIntoDB,
  getPropertyReviewsIntoDB,
} = reviewService;

const createReview = catchAsync(
  async (req: Request, res: Response) => {

    const tenantId = req.user!.id;

    const result = await createReviewIntoDB(
      req.body,
      tenantId
    );

    sendRes(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review submitted successfully.",
      data: result,
    });

  }
);

const getPropertyReviews = catchAsync(
  async (req: Request, res: Response) => {

    const propertyId = req.params.propertyId;

    const result =
      await getPropertyReviewsIntoDB(propertyId as string);

    sendRes(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reviews retrieved successfully.",
      data: result,
    });

  }
);

export const reviewController = {
  createReview,
  getPropertyReviews,
};