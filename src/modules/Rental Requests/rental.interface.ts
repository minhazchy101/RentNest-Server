export interface IRentalRequest {
    propertyId: string;
    moveInDate: Date;
    durationMonths: number;
    message?: string;
}