import { connectToDatabase } from "@/lib/mongodb";

export async function PATCH(req: Request, res: Response) {
  const { name, email, phoneNumber } = await req.json();
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ phoneNumber });
    if (!user) {
      return Response.json({ message: "User not found", success: false });
    }
    const res = await db.collection("users").updateOne(
      { phoneNumber },
      {
        $set: {
          name,
          email,
        },
      },
    );
    if (!res) {
      return Response.json({
        message: "Failed to update user",
        success: false,
      });
    }
    return Response.json({
      message: "User updated successfully",
      success: true,
    });
  } catch (error) {
    return Response.json({ message: "Failed to update user", success: false });
  }
}
