import bcrypt from "bcrypt"
import { prisma } from "../../lib/prisma"
import config from "../../config";
import { IUserLoginPayload, IUserPayload } from "./auth.interface";
import { jwtUtils } from "../../utilities/jwt";
import { SignOptions } from "jsonwebtoken";


const {bcrypt_salt_rounds,
            jwt_access_secret,
        jwt_access_expires_in,
     jwt_refresh_secret,
    jwt_refresh_expires_in

} = config;
const {createToken, verifyToken} = jwtUtils;

const userRegisterIntoDB =async (payload : IUserPayload)=> {
    const {name, email, password, role, phone, avatar} = payload;
     const isUserExits = await prisma.user.findUnique({
    where:{email}
   })
   if(isUserExits) throw new Error("User already Exits.!")

    const hashPass = await bcrypt.hash(password, Number(bcrypt_salt_rounds))

    const createdUser = await prisma.user.create({
        data : {
            name,
            email,
            password : hashPass,
            role,
            phone,
            avatar
        }
    });

     const user = await prisma.user.findUnique({
        where : {
            id : createdUser.id,
            email : email

        },
        omit : {
            password : true
        },
        // include:{
        //     profile : true
        // }
    })

    return user;
}

const userLoginIntoDB = async (payload : IUserLoginPayload )=>{
    const {email, password} = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where : {email}
    })
        const isPassMatched = await bcrypt.compare(password, user.password);

    if(!isPassMatched) {
        throw new Error("Wrong Password")
    }
        const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
        const accessToken = createToken(
        jwtPayload,
        jwt_access_secret,
        jwt_access_expires_in as SignOptions

    )
    const refreshToken = createToken(
     jwtPayload ,
     jwt_refresh_secret,
     jwt_refresh_expires_in as SignOptions 
    )

    return {
        accessToken,
        refreshToken
    };

}

const currentUserIntoDB = async(userId: string)=>{
    const user = await prisma.user.findFirstOrThrow({
        where : {id : userId},
        omit : {
            password : true
        }
    })
    return user;
}

const manageProfileIntoDB = async (
  userId: string,
  payload: any
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: payload,
     omit : {
            password : true
        }
  });

  return user;
};

const getUsersIntoDB = async()=>{
      const result = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
}

export const authServices = {
    userRegisterIntoDB,
    userLoginIntoDB,
    currentUserIntoDB,
    manageProfileIntoDB,
    getUsersIntoDB
}