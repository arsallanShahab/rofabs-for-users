import { UserRoles } from "@/lib/consts";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request, res: Response) {
  const { name, phoneNumber, avatar, id } = await req.json();
  const { db } = await connectToDatabase();
  const isExists = await db.collection("users").findOne({ phoneNumber });
  if (!isExists) {
    await db.collection("users").insertOne({
      username: name.toLowerCase().replace(/\s/g, ""),
      name,
      avatar,
      phoneNumber,
      role: UserRoles.USER,
      _id: id,
    });
    return Response.json({
      message: "User added successfully",
      success: true,
    });
  }
  return Response.json({
    message: "User already exists",
    success: false,
  });
}
