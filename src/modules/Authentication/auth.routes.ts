import { Router } from "express";
import { authControllers } from "./auth.controllers";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

const {
    userRegister,
    userLogin,
    currentUser,
    manageProfile,
    getUsers
} = authControllers

router.post('/register', userRegister )
router.post('/login', userLogin )
//admin management
router.get('/users', auth(Role.ADMIN), getUsers)
//role management
router.get('/me',auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), currentUser )
router.put('/manage-profile',auth(Role.TENANT,  Role.LANDLORD, Role.ADMIN), manageProfile )


export const authRoutes = router;