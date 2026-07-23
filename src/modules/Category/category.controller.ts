import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendRes } from "../../utilities/sendResponse";
import httpStatus from "http-status-codes"
import { categoryServices } from "./category.service";

const {createCategoriesIntoDB,
    getCategoriesIntoDB,
    updateCategoryIntoDB,
    deleteCategoryFromDB
} = categoryServices;

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

const getCategories = catchAsync(
  async (req: Request, res: Response) => {

    const result = await getCategoriesIntoDB();

    sendRes(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully.",
      data: result,
    });

  }
);

const updateCategory = catchAsync(
  async (req: Request, res: Response) => {

    const { id } = req.params;
    const payload = req.body;

    const result = await updateCategoryIntoDB(id as string, payload);

    sendRes(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category updated successfully.",
      data: result,
    });
  }
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {

    const { id } = req.params;

    const result = await deleteCategoryFromDB(id as string);


    sendRes(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category deleted successfully.",
      data: result,
    });

  }
);




export const categoryController = {
    createCategories,
    getCategories,
    updateCategory,
    deleteCategory
}