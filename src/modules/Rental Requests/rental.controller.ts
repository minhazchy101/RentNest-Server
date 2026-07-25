import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendRes } from "../../utilities/sendResponse";
import httpStatus from "http-status-codes"
import { rentalService } from "./Rental.service";


const {submitRentalIntoDB,
    myRentalHistoryIntoDB,
    rentalDetailsIntoDB,
    updateRentalStatusIntoDB,
    getRentalRequestsIntoDB} = rentalService;

const submitRental = catchAsync(
    async (req: Request, res: Response) => { 
        const payload = req.body;
       const tenantId = req.user!.id;

    const result = await submitRentalIntoDB(payload, tenantId);
        sendRes(res,{
      success: true,
      statusCode : httpStatus.CREATED,
     message: "Rental Request Submit successfully.",
     data : {
        result
      },
    })
    }
);

const myRentalHistory = catchAsync(
  async (req: Request, res: Response) => {

    const tenantId = req.user!.id;

    const result = await myRentalHistoryIntoDB(tenantId);

    sendRes(res,{
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental history retrieved successfully.",
      data: result,
    });
  }
);

const rentalDetails = catchAsync(
  async (req: Request, res: Response) => {

    const id = req.params.id;
    const tenantId = req.user!.id;

    const result = await rentalDetailsIntoDB(
      id as string,
      tenantId
    );

    sendRes(res,{
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental details retrieved successfully.",
      data: result,
    });
  }
);

const updateRentalStatus = catchAsync(
   async (req: Request, res: Response) => {

    const id = req.params.id;
    const tenantId = req.user!.id;
    const payload = req.body;
    const result = await updateRentalStatusIntoDB(
      id as string,
      tenantId,
      payload
    );

    sendRes(res,{
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental Status Updated successfully.",
      data: result,
    });
  }
);
const getRentalRequests = catchAsync(
  async (req: Request, res: Response) => {

    const landlordId = req.user!.id;

    const result = await getRentalRequestsIntoDB(
      landlordId
    );

    sendRes(res,{
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully.",
      data: result,
    });
  }
);



export const rentalController ={
    submitRental,
    myRentalHistory,
    rentalDetails,
    updateRentalStatus,
    getRentalRequests
}