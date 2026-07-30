import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./reviews.controller";


const router = Router();

const {
  createReview,
  getPropertyReviews,
} = reviewController;

router.post(
  "/",
  auth(Role.TENANT),
  createReview
);

router.get(
  "/property/:propertyId",
  getPropertyReviews
);

export const reviewRoutes = router;