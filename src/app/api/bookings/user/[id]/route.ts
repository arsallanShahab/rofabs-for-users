import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    const { db } = await connectToDatabase();
    const userBookings = await db
      .collection("bookings")
      .find({ user: id })
      .toArray();
    const data = [];
    for (const booking of userBookings) {
      const property = await db
        .collection("properties")
        .findOne({ _id: new ObjectId(booking.propertyId) });

      data.push({ booking: { ...booking }, property });
    }

    return Response.json({
      success: true,
      data: data,
    });
  } catch (error) {
    const err = error as Error & { message: string };
    return Response.json({
      success: false,
      error: err.message,
    });
  }
}
