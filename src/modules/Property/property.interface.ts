import { PropertyStatus } from "../../../generated/prisma/enums";

export interface IProperty {
  title: string;
  description: string;

  address: string;
  city: string;
  area?: string;
  zipCode?: string;

  rent: number;
  bedrooms: number;
  bathrooms: number;
  size?: number;

  amenities: string[];
  images: string[];

  categoryId: string;
}


export interface IPropertyQuery {

    searchTerm?: string;

    city?: string;

    minRent?: string;

    maxRent?: string;

    categoryId?: string;

    amenities?: string;

    status?: PropertyStatus;

    page?: string;

    limit?: string;

    sortBy?: string;

    sortOrder?: "asc" | "desc";

}