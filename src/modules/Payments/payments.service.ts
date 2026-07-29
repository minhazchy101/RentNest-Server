import config from "../../config";
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe";

const createPaymentSessionIntoDB =async(tenantID : string)=>{
     const transaction = await prisma.$transaction(async (tx)=>{
                const user = await tx.user.findFirstOrThrow({
            where : {
                id : tenantID
            },
            include : {
                rentalRequests : true
            }
        })
                let stripeCustomerId;
        // new customer
        if(!stripeCustomerId){
            const customer = await stripe.customers.create({
                email : user.email,
                name : user.name,
                metadata : {userId : user.id}
            })
            stripeCustomerId = customer.id;
        }

         const session = await stripe.checkout.sessions.create({
            line_items : [{
                price : config.Stripe_Product_Price_ID,
                quantity : 1
            }],
            mode : "subscription",
            payment_method_types : ["card"],
            success_url : `${config.app_url}/premium?success=true`,
            cancel_url : `${config.app_url}/payment?success=true`,
            metadata : {userId : user.id}
        })
          return session.url;
     })
       return {
        paymentUrl : transaction
    }

}

export const paymentsService = {
    createPaymentSessionIntoDB,
}