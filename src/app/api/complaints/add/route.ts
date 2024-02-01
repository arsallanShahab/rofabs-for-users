import { ComplaintProps } from "@/app/search/types";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const payload: ComplaintProps = await req.json();
  console.log(payload, "payload");
  const complaint: ComplaintProps = {
    owner_user_id: new ObjectId(payload.owner_user_id),
    propertyId: new ObjectId(payload.propertyId),
    propertyName: payload.propertyName,
    bookingId: new ObjectId(payload.bookingId),
    userId: payload.userId,
    userName: payload.userName,
    userPhoneNumber: payload.userPhoneNumber,
    userEmailAddress: payload.userEmailAddress,
    complaintType: payload.complaintType,
    complaintDetails: payload.complaintDetails,
    complaintStatus: payload.complaintStatus,
    isResolved: false,
    createdAt: new Date(),
  };
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("complaints").insertOne(complaint);
    return Response.json({
      success: true,
      message: "Complaint added successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
