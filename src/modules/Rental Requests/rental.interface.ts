import { RentalStatus } from "../../../generated/prisma/enums";

export interface IRentalRequest {
    propertyId: string;
    moveInDate: Date;
    durationMonths: number;
    message?: string;
}

export interface IUpdateRentalStatus {
    status: "APPROVED" | "REJECTED";
}