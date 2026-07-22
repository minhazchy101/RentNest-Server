import { Router } from "express";
import { authControllers } from "./auth.controllers";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

const {
    userRegister,
    userLogin,
    currentUser,
    manageProfile
} = authControllers

router.post('/register', userRegister )
router.post('/login', userLogin )
router.get('/me',auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), currentUser )
router.put('/manage-profile',auth(Role.TENANT,  Role.LANDLORD, Role.ADMIN), manageProfile )


export const authRoutes = router;