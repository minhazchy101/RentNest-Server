import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendRes } from "../../utilities/sendResponse";
import { paymentsService } from "./payments.service";

import httpStatus from "http-status-codes"

const { createPaymentSessionIntoDB,
       handleWebhookSession,
    getPaymentHistoryIntoDB,
    getPaymentDetailsIntoDB } = paymentsService;

const createPaymentSession = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const tenantId = req.user!.id;

        const { rentalRequestId } = req.body;

        const result = await createPaymentSessionIntoDB(
            rentalRequestId,
            tenantId
        );
        sendRes(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Check-out complete successfully.",
            data: result
        })
    }
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body as Buffer;

    const signature = req.headers["stripe-signature"] as string;

    await handleWebhookSession(payload, signature);

    res.status(200).json({
      received: true,
    });
  }
);

const getPaymentHistory = catchAsync(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.id;

    const result = await getPaymentHistoryIntoDB(tenantId);

    sendRes(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully.",
      data: result,
    });
  }
);

 const getPaymentDetails = catchAsync(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.id;
    const paymentId = req.params.id;

    const result = await getPaymentDetailsIntoDB(
      paymentId as string,
      tenantId
    );

    sendRes(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details retrieved successfully.",
      data: result,
    });
  }
);


export const paymentController = {
    createPaymentSession,
    handleWebhook,
    getPaymentHistory,
 getPaymentDetails
}