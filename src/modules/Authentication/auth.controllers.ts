import { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.services";
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utilities/catchAsync";
import { sendRes } from "../../utilities/sendResponse";

const {userRegisterIntoDB, 
      userLoginIntoDB,
     currentUserIntoDB,
     manageProfileIntoDB} = authServices;

const userRegister = catchAsync(
  async(req: Request, res: Response, next : NextFunction)=>{
        
        const  payload = req.body;
        const result = await userRegisterIntoDB(payload)
        // console.log(payload)
        sendRes(res,{
      success: true,
      statusCode : httpStatus.CREATED,
      message: "User Registration successfully.",
      data : {
        result
      },
    })

})

const userLogin = catchAsync(
    async(req: Request, res: Response, next : NextFunction)=>{
        
        const  payload = req.body;
        const  {
        accessToken,
        refreshToken} = await userLoginIntoDB(payload)
        // console.log(payload)
            res.cookie("accessToken", accessToken,{
        httpOnly: true,
        secure: false,
        sameSite : "none",
        maxAge: 1000 * 60 * 60 * 24
    })
    res.cookie("refreshToken", refreshToken,{
        httpOnly: true,
        secure: false,
        sameSite : "none",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })
        sendRes(res,{
      success: true,
      statusCode : httpStatus.OK,
      message: "User Login successfully.",
      data :  {
        accessToken,
        refreshToken},
    })

}
)

const currentUser = catchAsync(
      async(req: Request, res: Response, next : NextFunction)=>{
          const {id} = req.user!;
    console.log("Req User : ", id);
    const {accessToken} = req.cookies;

    const user = await currentUserIntoDB(id)
    sendRes(res, {
        success: true,
        statusCode: httpStatus.OK,
        message : "User Profile",
        data: {
            user
        }
    })
      })

const manageProfile = catchAsync (
  async(req: Request, res: Response, next : NextFunction)=>{
          const {id} = req.user!;
  
    const updatedUser = await manageProfileIntoDB(id, req.body);
   sendRes(res, {
  success: true,
  statusCode: httpStatus.OK,
  message: "Profile updated successfully",
  data: updatedUser,
});
      })

export const authControllers = {
    userRegister,
    userLogin,
    currentUser,
    manageProfile
}