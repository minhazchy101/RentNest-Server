import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

const {createProperty,
    getProperties,
    getPropertyDetails,
    updateProperty,
    deleteProperty
} = propertyController;

// Landlord Management
router.post("/landlord", auth(Role.LANDLORD), createProperty);
router.put("/:id/landlord", auth(Role.LANDLORD),    updateProperty);
router.delete("/:id/landlord", auth(Role.LANDLORD), deleteProperty)

// router.get("/my-properties",)

// router.patch("/:id/status",)

// public 
router.get("/", getProperties)
router.get("/:id", getPropertyDetails)

export const propertyRoutes = router;