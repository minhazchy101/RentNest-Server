import { Role } from "../../../generated/prisma/enums";

export interface IUserPayload {
    name : string;
    email : string;
    password : string;
    role : Role;
   phone?: string | null;
   avatar?: string | null;
}
export interface IUserLoginPayload {
    email : string;
    password : string;
}

