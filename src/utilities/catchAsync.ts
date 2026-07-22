import { NextFunction, Request,  RequestHandler,  Response } from "express";
import httpStatus from "http-status-codes"

export const catchAsync = (fun : RequestHandler)=>{
    return async (req: Request, res: Response, next: NextFunction)=>{
        try {
          await fun(req, res, next);  
        }  catch (error) {
       next(error)
    }
    }
}
