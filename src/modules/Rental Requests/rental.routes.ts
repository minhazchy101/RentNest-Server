import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";


const router = Router();

const {submitRental,
    myRentalHistory,
    rentalDetails,
    updateRentalStatus,
    getRentalRequests} = rentalController;

// Landlord
router.get("/landlord", auth(Role.LANDLORD), getRentalRequests);
router.patch("/landlord/:id", auth(Role.LANDLORD), updateRentalStatus);

// Tenant
router.post("/", auth(Role.TENANT), submitRental);
router.get("/my-requests", auth(Role.TENANT), myRentalHistory);
router.get("/:id", auth(Role.TENANT), rentalDetails);


export const rentalRoutes = router;