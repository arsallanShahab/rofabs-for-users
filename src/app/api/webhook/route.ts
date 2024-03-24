import { BookingStatusEnum, PaymentStatusEnum } from "@/lib/consts";
import { connectToDatabase } from "@/lib/mongodb";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const signature = request.headers.get("X-Razorpay-Signature") as string;
    validateWebhookSignature(
      JSON.stringify(text),
      signature,
      "65a9812b54bcff1b869b0321",
    );

    const payment = JSON.parse(text);
    if (payment.event !== "payment.captured") {
      return new Response("Success! webhook working", {
        status: 200,
      });
    }
    const entity = payment.payload.payment.entity;
    const orderType = entity.notes.orderType;

    if (orderType === "booking") {
      return handleBookingPayment(entity);
    }

    if (orderType === "subscription") {
      return handleSubscriptionPayment(entity);
    }
  } catch (error) {
    const err = error as Error & { message: string };
    return new Response(`Webhook error: ${err.message}`, {
      status: 400,
    });
  }
}

async function handleBookingPayment(entity: any) {
  const { db } = await connectToDatabase();
  const res = await db.collection("bookings").updateOne(
    {
      orderId: entity.order_id,
    },
    {
      $set: {
        paymentStatus: PaymentStatusEnum.PAID,
        bookingStatus: BookingStatusEnum.CONFIRMED,
      },
    },
  );

  return new Response(
    JSON.stringify({
      message: "Payment captured",
    }),
    {
      status: 200,
    },
  );
}

async function handleSubscriptionPayment(entity: any) {
  const { db } = await connectToDatabase();
  const res = await db.collection("subscriptions").updateOne(
    {
      orderId: entity.order_id,
    },
    {
      $set: {
        isPaymentComplete: true,
      },
    },
  );

  return new Response(
    JSON.stringify({
      message: "Payment captured",
    }),
    {
      status: 200,
    },
  );
}
