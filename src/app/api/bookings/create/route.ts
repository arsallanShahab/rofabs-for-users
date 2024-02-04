import { OrderProps } from "@/app/search/types";
import {
  BookingStatusEnum,
  BookingTypeEnum,
  PaymentStatusEnum,
} from "@/lib/consts";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId, UUID } from "mongodb";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  const payload: OrderProps = await request.json();

  const { db } = await connectToDatabase();
  const rooms = await db
    .collection("rooms")
    .find({
      roomType: payload.roomType,
      roomCategory: payload.roomCategory,
      propertyId: new ObjectId(payload.propertyId),
    })
    .toArray();
  const overlappingBookings = await db
    .collection("bookings")
    .find({
      propertyId: new ObjectId(payload.propertyId),
      roomType: payload.roomType,
      roomCategory: payload.roomCategory,
      from: { $gte: new Date(payload.from) },
      to: { $lte: new Date(payload.to) },
    })
    .toArray();
  const bookingTotalGuests = overlappingBookings.reduce((acc, curr) => {
    return acc + curr.numberOfGuests;
  }, 0);
  const totalGuess = bookingTotalGuests + payload.numberOfGuests;
  const totalMaxOccupancy = rooms.reduce((acc, curr) => {
    return acc + curr.maxOccupancy;
  }, 0);

  if (totalGuess > totalMaxOccupancy) {
    return Response.json({
      success: false,
      error: "No vacancy",
    });
  }

  // console.log(payload, "payload");
  const randomNum = Math.floor(Math.random() * 1000);
  const instance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
  });
  const uuid = new UUID();
  console.log(uuid, "uuid");
  const order = await instance.orders.create({
    amount: payload.amount * 100,
    currency: "INR",
    receipt: "R_" + uuid,
    notes: {
      guestName: payload.guestName,
      guestPhoneNumber: payload.guestPhoneNumber,
      guestEmail: payload.guestEmail,
      from: payload.from.toString(),
      to: payload.to.toString(),
      numberOfGuests: payload.numberOfGuests,
      roomType: payload.roomType,
      roomCategory: payload.roomCategory,
      propertyId: payload.propertyId,
      userId: payload.userId,
    },
  });
  const booking = {
    user: new ObjectId(payload.userId),
    propertyId: new ObjectId(payload.propertyId),
    bookingType: BookingTypeEnum.ONLINE,
    bookingStatus: BookingStatusEnum.NOT_CONFIRMED,
    guestName: payload.guestName,
    guestPhoneNumber: payload.guestPhoneNumber,
    guestEmail: payload.guestEmail,
    roomCategory: payload.roomCategory,
    roomType: payload.roomType,
    from: new Date(payload.from),
    to: new Date(payload.to),
    numberOfGuests: payload.numberOfGuests,
    isCheckedIn: false,
    isCheckedOut: false,
    isCancelled: false,
    paymentStatus: PaymentStatusEnum.NOT_PAID,
    paymentAmount: payload.amount,
    invoiceId: order.receipt,
    orderId: order.id,
    createdAt: new Date(),
  };
  await db.collection("bookings").insertOne(booking);
  // console.log(order, "order");
  return Response.json(order);
}
