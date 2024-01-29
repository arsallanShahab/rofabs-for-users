import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    const { db } = await connectToDatabase();
    const booking = await db
      .collection("bookings")
      .findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return Response.json({
        success: false,
        error: "Booking not found",
      });
    }
    const property = await db
      .collection("properties")
      .findOne({ _id: new ObjectId(booking.propertyId) });
    if (!property) {
      return Response.json({
        success: false,
        error: "Property not found",
      });
    }
    const room = await db.collection("rooms").findOne({
      propertyId: new ObjectId(property._id),
      roomType: booking.roomType,
      roomCategory: booking.roomCategory,
    });
    return Response.json({
      success: true,
      data: {
        booking,
        property,
        room,
      },
    });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({
      success: false,
      error: err.message,
    });
  }
}
