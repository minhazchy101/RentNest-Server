import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

const {createProperty,
    getProperties,
    getPropertyDetails,
    updateProperty,
    deleteProperty,
    getMyProperties
} = propertyController;

// Landlord Management
router.post("/landlord", auth(Role.LANDLORD), createProperty);
router.get("/landlord", auth(Role.LANDLORD), getMyProperties)
router.put("/:id/landlord", auth(Role.LANDLORD),    updateProperty);
router.delete("/:id/landlord", auth(Role.LANDLORD), deleteProperty)

// public 
router.get("/", getProperties)
router.get("/:id", getPropertyDetails)

// router.patch("/:id/status",)


export const propertyRoutes = router;