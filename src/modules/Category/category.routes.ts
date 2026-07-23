import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

const {createCategories} = categoryController;

router.post("/", auth(Role.ADMIN), createCategories)
router.get("/get-categories", createCategories)
router.get("/:id", createCategories)
router.put("/:id", createCategories)
router.delete("/:id", createCategories)

export const categoryRoutes = router;