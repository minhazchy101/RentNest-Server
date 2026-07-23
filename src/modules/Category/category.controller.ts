import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendRes } from "../../utilities/sendResponse";
import httpStatus from "http-status-codes"
import { categoryServices } from "./category.service";

const {createCategoriesIntoDB} = categoryServices;

const createCategories = catchAsync(
    async(req: Request, res: Response, next : NextFunction)=>{
       

        const payload = req.body;
        const result = await createCategoriesIntoDB(payload)
         sendRes(res,{
      success: true,
      statusCode : httpStatus.CREATED,
     message: "Category created successfully.",
     data : {
        result
      },
    })
    }
)

export const categoryController = {
    createCategories
}