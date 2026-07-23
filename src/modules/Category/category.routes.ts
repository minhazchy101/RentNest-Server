import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

const {createCategories, getCategories, updateCategory, deleteCategory} = categoryController;

router.post("/", auth(Role.ADMIN), createCategories)
router.get("/", getCategories)
router.put("/:id", auth(Role.ADMIN), updateCategory);
router.delete("/:id", auth(Role.ADMIN), deleteCategory);

export const categoryRoutes = router;