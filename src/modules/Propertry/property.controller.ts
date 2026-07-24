import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { propertyService } from "./property.service";

import httpStatus from "http-status-codes"
import { sendRes } from "../../utilities/sendResponse";
const {createPropertyIntoDB, 
  getPropertiesIntoDB,
   getPropertyDetailsIntoDB,
  updatePropertyIntoDB,
  deletePropertyIntoDB
  
} = propertyService;

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

const getProperties = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;
    const result = await getPropertiesIntoDB(
     query
    );

    sendRes(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully.",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getPropertyDetails = catchAsync(
  async (req: Request, res: Response) => {

    const { id } = req.params;

    const result = await getPropertyDetailsIntoDB(id as string);

    sendRes(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property retrieved successfully.",
      data: result,
    });
  }
);

const updateProperty = catchAsync(
  async (req: Request, res: Response) => {

    const { id } = req.params;

    const payload = req.body;

    const landlordId = req.user!.id;


    const result = await updatePropertyIntoDB(
      id as string,
      landlordId,
      payload
    );


    sendRes(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property updated successfully.",
      data: result,
    });
  }
);

const deleteProperty = catchAsync(
  async(req:Request,res:Response)=>{


    const {id}=req.params;

    const landlordId= req.user!.id;


    const result =
      await deletePropertyIntoDB(
        id as string,
        landlordId
      );


    sendRes(res,{
      success:true,
      statusCode:httpStatus.OK,
      message:"Property deleted successfully.",
      data:result
    });

  }
)


export const propertyController ={
    createProperty,
    getProperties,
    getPropertyDetails,
    updateProperty,
deleteProperty
}