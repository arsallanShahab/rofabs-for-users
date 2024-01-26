import { UserRoles } from "@/lib/consts";
import { connectToDatabase } from "@/lib/mongodb";
import { comparePassword, hashPassword } from "@/lib/utils";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request, res: Response) {
  const cookieStore = cookies();
  try {
    const { db } = await connectToDatabase();
    const token = cookieStore.get("token");
    if (!token) {
      return Response.json({
        message: "User not logged in",
        success: false,
        data: null,
      });
    }
    const verifyToken = verify(token.value, process.env.JWT_SECRET as string);
    console.log(verifyToken, "verifyToken");

    return Response.json({
      message: "User logged in successfully",
      success: true,
      data: verifyToken,
    });
  } catch (error) {
    const err = error as Error & { message: string; success: boolean };
    return Response.json({ message: err.message, success: false });
  }
}
