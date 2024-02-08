import { ReviewProps } from "@/app/search/types";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const payload: ReviewProps = await req.json();
  const review: ReviewProps = {
    owner_user_id: new ObjectId(payload.owner_user_id),
    propertyId: new ObjectId(payload.propertyId),
    propertyName: payload.propertyName,
    bookingId: new ObjectId(payload.bookingId),
    userId: payload.userId,
    userName: payload.userName,
    userPhoneNumber: payload.userPhoneNumber,
    userEmailAddress: payload.userEmailAddress,
    profilePicture: payload.profilePicture,
    rating: payload.rating,
    review: payload.review,
    createdAt: new Date(),
  };
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("reviews").insertOne(review);
    return Response.json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
