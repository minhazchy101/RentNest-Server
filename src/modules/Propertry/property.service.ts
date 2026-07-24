import { IProperty, IPropertyQuery } from "./property.interface";
import { prisma } from "../../lib/prisma";
import { PropertyStatus } from "../../../generated/prisma/enums";
import { Prisma } from "../../../generated/prisma/client";


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

  // Create property
  const result = await prisma.property.create({
    data: propertyData,
  });

  return result;
};


const getPropertiesIntoDB = async (
  query: IPropertyQuery
) => {
  const {
    searchTerm,
    city,
    minRent,
    maxRent,
    categoryId,
    amenities,
    status,

    page = "1",
    limit = "10",

    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  // Pagination
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.max(Number(limit) || 10, 1);
  const skip = (currentPage - 1) * pageSize;

  // Whitelist Sorting
  const allowedSortFields = ["createdAt", "rent", "title"];

  const finalSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const finalSortOrder =
    sortOrder === "asc" ? "asc" : "desc";

  // Dynamic Where
  const whereConditions: Prisma.PropertyWhereInput = {};
 
  
  // Search
  if (searchTerm) {
    whereConditions.OR = [
      {
        title: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        city: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        address: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  // Location
  if (city) {
    whereConditions.city = {
      contains: city,
      mode: "insensitive",
    };
  }

  // Category
  if (categoryId) {
    whereConditions.categoryId = categoryId;
  }

  // Property Status
  if (status) {
    whereConditions.status = status as PropertyStatus;
  }

  // Price Range
  if (minRent || maxRent) {
    whereConditions.rent = {};

    if (minRent) {
      whereConditions.rent.gte = Number(minRent);
    }

    if (maxRent) {
      whereConditions.rent.lte = Number(maxRent);
    }
  }

  // Amenities
  if (amenities) {
    whereConditions.amenities = {
      hasSome: amenities.split(","),
    };
  }

  // Database Query
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: whereConditions,

      skip,
      take: pageSize,

      orderBy: {
        [finalSortBy]: finalSortOrder,
      },

      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },

        landlord: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),

    prisma.property.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
    },

    data: properties,
  };
};


export const propertyService = {
  createPropertyIntoDB,
  getPropertiesIntoDB
};
