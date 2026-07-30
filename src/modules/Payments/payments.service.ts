import { PaymentProvider, PaymentStatus, PropertyStatus, RentalStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";

const createPaymentSessionIntoDB = async (
  rentalRequestId: string,
  tenantId: string
) => {
  // rental request
  const rentalRequest = await prisma.rentalRequest.findFirstOrThrow({
    where: {
      id: rentalRequestId,
      tenantId,
    },

    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      property: {
        select: {
          id: true,
          title: true,
          rent: true,
        },
      },

      payment: true,
    },
  });

  if (rentalRequest.status !== RentalStatus.APPROVED) {
    throw new Error(
      "This rental request is not approved for payment."
    );
  }
  if (rentalRequest.payment) {
    throw new Error(
      "Payment has already been completed for this rental request."
    );
  }

  // Stripe Customer
  const customer = await stripe.customers.create({
    email: rentalRequest.tenant.email,
    name: rentalRequest.tenant.name,

    metadata: {
      tenantId,
    },
  });

  // Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    customer: customer.id,

    payment_method_types: ["card"],

    line_items: [
      {
        quantity: 1,

        price_data: {
          currency: "usd",

          unit_amount: Math.round(
            rentalRequest.property.rent * 100
          ),

          product_data: {
            name: rentalRequest.property.title,
          },
        },
      },
    ],

    success_url: `${config.app_url}/payment/success`,

    cancel_url: `${config.app_url}/payment/cancel`,

    metadata: {
      rentalRequestId,
      tenantId,
    },
  });

  return {
    checkoutUrl: session.url,
  };
};

const handleWebhookSession = async (
  payload: Buffer,
  signature: string
) => {

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe_webhook_secret
  );

  switch (event.type) {

    case "checkout.session.completed":

      await handleCheckoutComplete(
        event.data.object as Stripe.Checkout.Session
      );

      break;

    default:

      console.log(`Unhandled event: ${event.type}`);

  }

};

 const handleCheckoutComplete = async (
  session: Stripe.Checkout.Session
) => {
  try {
  const rentalRequestId = session.metadata?.rentalRequestId;

  if (!rentalRequestId) {
    throw new Error("Rental request id is missing.");
  }

  const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
    where: {
      id: rentalRequestId,
    },

    include: {
      property: {
        select: {
          id: true,
          rent: true,
        },
      },

      payment: true,
    },
  });

  // Webhook retry protection
  if (rentalRequest.payment) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Create Payment
    await tx.payment.create({
  data: {
    rentalRequestId,

    amount: rentalRequest.property.rent,

    provider: PaymentProvider.STRIPE,

    status: PaymentStatus.COMPLETED,

    transactionId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : null,

    method: "card",

    paidAt: new Date(),
  },
});

    // Rental COMPLETED
    await tx.rentalRequest.update({
      where: {
        id: rentalRequestId,
      },

      data: {
        status: RentalStatus.COMPLETED,
      },
    });

    // Property RENTED
    await tx.property.update({
      where: {
        id: rentalRequest.property.id,
      },

      data: {
        status: PropertyStatus.RENTED,
      },
    });
  });
  } catch (err) {
    console.error(err);

   throw err;
  }
};
const getPaymentHistoryIntoDB = async (
  tenantId: string
) => {

  const payments = await prisma.payment.findMany({

    where: {
      rentalRequest: {
        tenantId,
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {

      rentalRequest: {

        select: {

          id: true,

          status: true,

          property: {

            select: {

              id: true,
              title: true,
              city: true,
              rent: true,

              category: {

                select: {
                  id: true,
                  name: true,
                },

              },

            },

          },

        },

      },

    },

  });

  return payments;
};

const getPaymentDetailsIntoDB = async (
  paymentId: string,
  tenantId: string
) => {
  console.log({
  paymentId,
  tenantId,
});
  const payment = await prisma.payment.findFirstOrThrow({

    where: {

      id: paymentId,

      rentalRequest: {
        tenantId,
      },

    },

    include: {

      rentalRequest: {

        include: {

          property: {

            include: {

              category: {
                select: {
                  id: true,
                  name: true,
                },
              },

            },

          },

        },

      },

    },

  });

  return payment;
};

export const paymentsService = {
    createPaymentSessionIntoDB,
    handleWebhookSession,
    getPaymentHistoryIntoDB,
getPaymentDetailsIntoDB
}