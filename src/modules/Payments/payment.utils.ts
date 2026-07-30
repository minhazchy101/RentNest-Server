import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

export const getPeriodEnd = (payload: Stripe.Subscription) => {
    const currentPeriodEndInMilliseconds = payload.items.data[0]?.current_period_end!

    const currentPeriodEnd = new Date(currentPeriodEndInMilliseconds * 1000)

    return currentPeriodEnd
}

export const handleCheckOutComplete = async (session : Stripe.Checkout.Session )=>{
      const userId = session.metadata?.userId;
    const stripeCustomerId = session.customer as string;
    const stripeSubscriptionId = session.subscription as string;
    
    //  console.log(`PaymentIntent for ${session.amount} was successful!`);
    
    if(!userId ||
        !stripeCustomerId ||
        !stripeSubscriptionId){
            console.log("Webhook failed");
            return
        }
        
        const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
         console.log(`PaymentIntent for ${stripeSubscription.items.data[0]} was successful!`);
      
        //  const currentPeriodStart = stripeSubscription.items.data[0]?.current_period_start
        //  const currentPeriodEndInMil = stripeSubscription.items.data[0]?.current_period_end!
         const currentPeriodEnd = getPeriodEnd(stripeSubscription)

        await prisma.subscription.upsert({
            where : {
                userId
            },
            create: {
                userId,
                stripeCustomerId,
                stripeSubscriptionId,
                status : "ACTIVE",
                currentPeriodEnd
            },
            update : {
                stripeCustomerId,
                stripeSubscriptionId,
                status : "ACTIVE",
                currentPeriodEnd
            }
        })
}
// new codes

export const handleChangeSubscription = async (payload : Stripe.Subscription)=>{
    const stripeSubscriptionId = payload.id;

    const status = 
    (payload.status == "active" || payload.status == "trialing") 
    ? SubscriptionStatus.ACTIVE : 
    payload.status == "canceled" ? SubscriptionStatus.CANCELLED : 
    SubscriptionStatus.EXPIRED;

    // it would be a function 
    
       const currentPeriodEnd = getPeriodEnd(payload)

    const isSubscription = await prisma.subscription.findUnique({
        where : {
            stripeSubscriptionId
        }
    })
    if(!isSubscription){
        console.log(`Webhook : No subscription found for subscription id : ${stripeSubscriptionId}`)
        return;
    }
    await prisma.subscription.update({
        where : {
            stripeSubscriptionId
        },
        data: {
            status,
            currentPeriodEnd
        }
    })
}