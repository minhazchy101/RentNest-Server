import { Router } from "express";
import { paymentController } from "./payments.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

const {createPaymentSession,
} = paymentController;

router.post('/create', auth(Role.TENANT), createPaymentSession)

export const paymentRoutes = router;