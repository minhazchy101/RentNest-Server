import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendRes } from "../../utilities/sendResponse";
import { paymentsService } from "./payments.service";

import httpStatus from "http-status-codes"

const { createPaymentSessionIntoDB } = paymentsService;
const createPaymentSession = catchAsync(
      async(req: Request, res: Response, next : NextFunction)=>{
              const tenantID = req.user?.id

        const result = await createPaymentSessionIntoDB(tenantID as string)
      sendRes(res, {
        success : true,
        statusCode : httpStatus.OK,
        message: "Check-out complete successfully.",
        data : result
    })
    }
);


export const paymentController = {
    createPaymentSession,
   
}