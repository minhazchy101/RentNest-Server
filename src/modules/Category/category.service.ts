import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface"

const createCategoriesIntoDB = async (payload: ICategory) => {
    
  // Trim the original name
  const name = payload.name.trim();

  // Normalize for duplicate checking
  const normalizedName = name.toLowerCase();

  // Empty name check
  if (!name) {
    throw new Error(
      "Category name is required."
    );
  }

  // Duplicate check (case-insensitive)
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
    },
  });

  if (existingCategory) {
    throw new Error(
      "Category already exists."
    );
  }

  // Create category
  const result = await prisma.category.create({
    data: {
      name, 
      description: payload.description?.trim() || null,
    },
  });

  return result;
};

export const categoryServices = {
    createCategoriesIntoDB
}