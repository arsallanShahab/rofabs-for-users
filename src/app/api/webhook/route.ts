import {
  BookingStatusEnum,
  BookingTypeEnum,
  PaymentStatusEnum,
} from "@/lib/consts";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
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

    const { db } = await connectToDatabase();
    const entity = payment.payload.payment.entity;
    const isOrderExists = await db
      .collection("bookings")
      .findOne({ invoiceId: entity.id });

    if (isOrderExists) {
      return new Response("Order already exists", {
        status: 200,
      });
    }
    console.log(entity, "entity");

    const rooms = await db
      .collection("rooms")
      .find({
        propertyId: new ObjectId(entity.notes.propertyId),
        roomCategory: entity.notes.roomCategory,
        roomType: entity.notes.roomType,
      })
      .toArray();

    const roomsWithVacany = rooms.filter((room) => room.vacancy > 0);
    //5 room double
    let nog = entity.notes.numberOfGuests;

    for (const room of roomsWithVacany) {
      if (nog > room.vacancy) {
        nog = nog - room.vacancy;
        await db.collection("rooms").updateOne(
          {
            _id: new ObjectId(room._id),
          },
          {
            $set: {
              vacancy: 0,
            },
          },
        );
      } else {
        await db.collection("rooms").updateOne(
          {
            _id: new ObjectId(room._id),
          },
          {
            $set: {
              vacancy: room.vacancy - nog,
            },
          },
        );
        break;
      }
    }

    console.log(roomsWithVacany, "roomsWithVacany");

    for (const room of rooms) {
      if (room.vacancy >= entity.notes.numberOfGuests) {
        await db.collection("rooms").updateOne(
          {
            _id: new ObjectId(room._id),
          },
          {
            $set: {
              vacancy: room.vacancy - entity.notes.numberOfGuests,
            },
          },
        );
        break;
      } else {
        await db.collection("rooms").updateOne(
          {
            _id: new ObjectId(room._id),
          },
          {
            $set: {
              vacancy: 0,
            },
          },
        );
      }
    }

    const booking = {
      user: new ObjectId(entity.notes.userId),
      propertyId: new ObjectId(entity.notes.propertyId),
      bookingType: BookingTypeEnum.ONLINE,
      bookingStatus: BookingStatusEnum.CONFIRMED,
      guestName: entity.notes.guestName,
      guestPhoneNumber: parseInt(entity.notes.guestPhoneNumber),
      guestEmail: entity.notes.guestEmail,
      roomCategory: entity.notes.roomCategory,
      roomType: entity.notes.roomType,
      from: new Date(entity.notes.from),
      to: new Date(entity.notes.to),
      numberOfGuest: parseInt(entity.notes.numberOfGuests),
      paymentMethod: entity.method,
      paymentStatus: PaymentStatusEnum.PAID,
      paymentAmount: entity.amount / 100,
      invoiceId: entity.id,
    };

    await db.collection("bookings").insertOne(booking);

    return new Response(
      JSON.stringify({
        message: "Payment captured",
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    const err = error as Error & { message: string };
    return new Response(`Webhook error: ${err.message}`, {
      status: 400,
    });
  }
}
