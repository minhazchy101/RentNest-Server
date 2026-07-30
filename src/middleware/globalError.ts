import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status-codes"
import { Prisma } from "../../generated/prisma/client";
export const globalError = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = err.message || "Internal Server Error";
  let errorName = err.name || "Internal Server Error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields"
  }
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Duplicate key Error"
    }
    else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Foreign key constraint failed";
    }
    else if (err.code === "P2025") {
      statusCode = httpStatus.NOT_FOUND;
      errorMessage = "The requested record was not found.";
    }
  }
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = "Please check your database credentials.";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus.SERVICE_UNAVAILABLE;
      errorMessage = "Unable to connect to the database server. Please try again later.";
    }
  }
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage = "An unexpected database error occurred.";
  }
  /* if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = httpStatus.CONFLICT;
        errorMessage = "A record with this value already exists.";
        break;
  
      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "Foreign key constraint failed.";
        break;
  
      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        errorMessage = "Record not found.";
        break;
  
      default:
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "The database request could not be completed.";
    }
  }
  */
  
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: statusCode,
    // errorCode : err.code || null,
    name: errorName,
    message: errorMessage,
    error: err.stack
  })
}