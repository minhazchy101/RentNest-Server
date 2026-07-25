import { PropertyStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IRentalRequest } from "./rental.interface"

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

const updateRentalStatusIntoDB = async()=>{

}
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

export const rentalService = {
    submitRentalIntoDB,
    myRentalHistoryIntoDB,
    rentalDetailsIntoDB,
    updateRentalStatusIntoDB,
    getRentalRequestsIntoDB
}