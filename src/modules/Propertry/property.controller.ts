import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { propertyService } from "./property.service";

import httpStatus from "http-status-codes"
import { sendRes } from "../../utilities/sendResponse";
const {createPropertyIntoDB} = propertyService;

const createProperty = catchAsync(
     async(req: Request, res: Response, next : NextFunction)=>{
        const payload = req.body;
        const landlordId = req.user?.id;

        const result = await createPropertyIntoDB(payload, landlordId as string)

         sendRes(res,{
      success: true,
      statusCode : httpStatus.CREATED,
     message: "Property created successfully.",
     data : {
        result
      },
    })
     }
)


export const propertyController ={
    createProperty
}