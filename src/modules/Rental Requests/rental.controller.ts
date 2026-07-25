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

    }
);
const rentalDetails = catchAsync(
    async (req: Request, res: Response) => { 

    }
);
const updateRentalStatus = catchAsync(
    async (req: Request, res: Response) => { 

    }
);
const getRentalRequests = catchAsync(
    async (req: Request, res: Response) => { 

    }
);



export const rentalController ={
    submitRental,
    myRentalHistory,
    rentalDetails,
    updateRentalStatus,
    getRentalRequests
}