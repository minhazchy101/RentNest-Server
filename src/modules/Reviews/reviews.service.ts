import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IReview } from "./review.interface";



const createReviewIntoDB = async (
  payload: IReview,
  tenantId: string
) => {

  // Check property exists
  await prisma.property.findUniqueOrThrow({

    where: {
      id: payload.propertyId,
    },

    select: {
      id: true,
    },

  });


  // Check completed rental
  const completedRental =
    await prisma.rentalRequest.findFirst({

      where: {

        tenantId,

        propertyId: payload.propertyId,

        status: RentalStatus.COMPLETED,

      },

      select: {
        id: true,
      },

    });


  if (!completedRental) {
    throw new Error(
      "Review is allowed only after a completed rental."
    );
  }


  // Duplicate review
  const existingReview =
    await prisma.review.findUnique({

      where: {

        tenantId_propertyId: {

          tenantId,

          propertyId: payload.propertyId,

        },

      },

      select: {
        id: true,
      },

    });


  if (existingReview) {
    throw new Error(
      "Review already submitted."
    );
  }


  // Rating validation
  if (
    payload.rating < 1 ||
    payload.rating > 5
  ) {
    throw new Error(
      "Rating must be between 1 and 5."
    );
  }


  const review =
    await prisma.review.create({

      data: {

        rating: payload.rating,

        comment: payload.comment.trim(),

        tenantId,

        propertyId: payload.propertyId,

      },

    });


  return review;

};





const getPropertyReviewsIntoDB = async (
  propertyId: string
) => {

  await prisma.property.findUniqueOrThrow({

    where: {
      id: propertyId,
    },

    select: {
      id: true,
    },

  });


  const reviews =
    await prisma.review.findMany({

      where: {
        propertyId,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {

        tenant: {

          select: {

            id: true,

            name: true,

          },

        },

      },

    });


  return reviews;

};



export const reviewService = {

  createReviewIntoDB,

  getPropertyReviewsIntoDB,

};