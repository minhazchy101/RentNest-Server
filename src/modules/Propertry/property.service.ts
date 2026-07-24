import { IProperty } from "./property.interface";
import { prisma } from "../../lib/prisma";

const createPropertyIntoDB = async (
  payload: IProperty,
  landlordId: string
) => {
 const { 
    title,
    description,
    address,
    city,
    area,
    zipCode} = payload;

  // Check category exists
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new Error(  "Category not found.");
  }

  // Business Rules
  if (payload.rent <= 0) {
    throw new Error(
      "Rent must be greater than 0."
    );
  }

  if (payload.bedrooms < 1) {
    throw new Error(
      "Bedrooms must be at least 1."
    );
  }

  if (payload.bathrooms < 1) {
    throw new Error(
      "Bathrooms must be at least 1."
    );
  }

  // Prepare data
  const propertyData = {
    title,
    description,

    address,
    city,
    area,
    zipCode,

    rent: payload.rent,
    bedrooms: payload.bedrooms,
    bathrooms: payload.bathrooms,
    size: payload.size,

    amenities: payload.amenities,
    images: payload.images,

    landlordId,
    categoryId: payload.categoryId,
  };
  console.log("property Data: ", propertyData)

  // Create property
  const result = await prisma.property.create({
    data: propertyData,
  });

  return result;
};

export const propertyService = {
  createPropertyIntoDB,
};
