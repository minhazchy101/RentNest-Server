import { Router } from "express";
import { paymentController } from "./payments.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

const { createPaymentSession,
    getPaymentHistory,
    getPaymentDetails
} = paymentController;

router.post('/create', auth(Role.TENANT), createPaymentSession)
router.get("/", auth(Role.TENANT), getPaymentHistory);
router.get("/:id", auth(Role.TENANT), getPaymentDetails);
export const paymentRoutes = router;