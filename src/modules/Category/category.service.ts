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

const getCategoriesIntoDB = async () => {
  const result = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const updateCategoryIntoDB = async (
  id: string,
  payload: any
) => {

  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    throw new Error("Category not found.");
  }


  if (payload.name !== undefined) {

    const updatedName = payload.name.trim();

    if (!updatedName) {
      throw new Error(
        "Category name cannot be empty."
      );
    }


    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: updatedName,
          mode: "insensitive",
        },
        NOT: {
          id,
        },
      },
    });


    if (duplicateCategory) {
      throw new Error(
        "Category already exists."
      );
    }


    payload.name = updatedName;
  }


  if (payload.description !== undefined) {
    payload.description =
      payload.description.trim() || null;
  }


  const result = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });


  return result;
};


const deleteCategoryFromDB = async (id: string) => {

  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });


  if (!existingCategory) {
    throw new Error(
     "Category not found."
    );
  }


  const result = await prisma.category.delete({
    where: {
      id,
    },
  });


  return result;
};



export const categoryServices = {
    createCategoriesIntoDB,
    getCategoriesIntoDB,
    updateCategoryIntoDB,
    deleteCategoryFromDB
}