import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

const {createProperty} = propertyController;

router.post("/", auth(Role.LANDLORD), createProperty);
// router.get("/",)
// router.get("/:id",)
// router.get("/my-properties",)
// router.put("/:id",)
// router.delete("/:id",)
// router.patch("/:id/status",)

export const propertyRoutes = router;