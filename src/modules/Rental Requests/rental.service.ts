import { PropertyStatus, RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IRentalRequest, IUpdateRentalStatus } from "./rental.interface"

const submitRentalIntoDB = async (
  payload: IRentalRequest,
  tenantId: string
) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: payload.propertyId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (property.status !== PropertyStatus.AVAILABLE) {
    throw new Error(
      "Property is not available."
    );
  }

const existingRequest = await prisma.rentalRequest.findUnique({
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

if (existingRequest) {
  throw new Error(
    "Rental request already submitted."
  );
}

const moveInDate = new Date(payload.moveInDate);

if (isNaN(moveInDate.getTime())) {
  throw new Error(
    "Invalid move in date."
  );
}
  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      moveInDate,
      durationMonths: payload.durationMonths,
      message: payload.message?.trim(),
    },
  });

  return rentalRequest;
};

const myRentalHistoryIntoDB = async(tenantId: string)=>{
  const rentalRequestsHistory = await prisma.rentalRequest.findMany({
  where:{
    tenantId,
  },

  orderBy:{
    createdAt:"desc",
  },

  include:{
    property:{
      select:{
        id:true,
        title:true,
        city:true,
        address:true,
        rent:true,
        status:true,

        category:{
          select:{
            id:true,
            name:true,
          }
        }
      }
    },

  }
});
return rentalRequestsHistory;
}

const rentalDetailsIntoDB = async (
  id: string,
  tenantId: string
) => {

  const rentalRequest =
    await prisma.rentalRequest.findFirstOrThrow({

      where:{
        id,
        tenantId,
      },

      include:{
        property:{
          select:{
            id:true,
            title:true,
            city:true,
            address:true,
            rent:true,
            status:true,

            category:{
              select:{
                id:true,
                name:true,
              },
            },
          },
        },
      },

    });


  return rentalRequest;
};

const getRentalRequestsIntoDB = async (
  landlordId: string
) => {

  const rentalRequests =
    await prisma.rentalRequest.findMany({

      where:{
        property:{
          landlordId,
        },
      },

      orderBy:{
        createdAt:"desc",
      },

      include:{

        property:{
          select:{
            title:true,
            status:true,
            category:{
              select:{
                id:true,
                name:true,
              },
            },
          },
        },

      },

    });


  return rentalRequests;
};

const updateRentalStatusIntoDB = async (
  rentalRequestId: string,
  landlordId: string,
  payload: IUpdateRentalStatus
) => {

  const rentalRequest =
    await prisma.rentalRequest.findFirstOrThrow({

      where: {
        id: rentalRequestId,

        property: {
          landlordId,
        },
      },

      select: {
        id: true,
        propertyId: true,
        status: true,
      },

    });


  // Current status check
  if (rentalRequest.status !== RentalStatus.PENDING) {
    throw new Error(
      "Only pending rental requests can be updated."
    );
  }


  // New status validation
  if (
    ![
      RentalStatus.APPROVED,
      RentalStatus.REJECTED,
    ].includes(payload.status)
  ) {
    throw new Error(
      "Only APPROVED or REJECTED status is allowed."
    );
  }



  const result = await prisma.$transaction(async (tx) => {


    // APPROVE FLOW
    if (payload.status === RentalStatus.APPROVED) {


      const updatedRequest =
        await tx.rentalRequest.update({

          where: {
            id: rentalRequestId,
          },

          data: {
            status: RentalStatus.APPROVED,
            approvedAt: new Date(),
          },

        });



      // Reject other pending requests
      await tx.rentalRequest.updateMany({

        where: {

          propertyId: rentalRequest.propertyId,

          status: RentalStatus.PENDING,

          id: {
            not: rentalRequestId,
          },

        },

        data: {

          status: RentalStatus.REJECTED,
          rejectedAt: new Date(),

        },

      });


      return updatedRequest;

    }



    // REJECT FLOW
    const updatedRequest =
      await tx.rentalRequest.update({

        where: {
          id: rentalRequestId,
        },

        data: {

          status: RentalStatus.REJECTED,
          rejectedAt: new Date(),

        },

      });


    return updatedRequest;

  });


  return result;
};

export const rentalService = {
    submitRentalIntoDB,
    myRentalHistoryIntoDB,
    rentalDetailsIntoDB,
    updateRentalStatusIntoDB,
    getRentalRequestsIntoDB
}