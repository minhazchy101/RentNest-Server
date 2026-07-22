import { NextFunction, Request, Response, Router } from "express";

import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utilities/catchAsync";
import { jwtUtils } from "../utilities/jwt";
import config from "../config";
import { prisma } from "../lib/prisma";



declare global {
        namespace Express {
            interface Request {
                user?:{
                    email : string;
                    name : string;
                    id : string;
                    role : string;
                }
            }
        }
    }
    
export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ? req.cookies.accessToken :
         req.headers.authorization?.startsWith("Bearer ") ?
          req.headers.authorization?.split(" ")[1] : 
          req.headers.authorization;
        // console.log("the token", token)
        // || req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;
        if (!token) {
            throw new Error("Authentication token is required.");
        }
        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret)
        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        }
        const { id, name, email, role } = verifiedToken.data as JwtPayload;
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("Access denied: You do not have the required role.");
        }
            const user = await prisma.user.findFirstOrThrow({
                where : {
                    id,
                    email,
                    name,
                    role
                },
            })
           if (!user) {
  throw new Error("Authentication failed: User not found.");
}
        if (user.status === "BANNED") {
  throw new Error("Access denied: Your account has been blocked.");
}
req.user={
        email,
        name,
        id,
        role
    }
    next();
})

}