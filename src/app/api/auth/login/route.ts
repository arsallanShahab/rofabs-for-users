import { UserRoles } from "@/lib/consts";
import { connectToDatabase } from "@/lib/mongodb";
import { comparePassword, hashPassword } from "@/lib/utils";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request, res: Response) {
  const { phoneNumber, otp } = await req.json();
  const cookieStore = cookies();
  try {
    const { db } = await connectToDatabase();
    const isExists = await db.collection("users").findOne({ phoneNumber, otp });
    if (!isExists) {
      return Response.json({
        message: "User not found",
        success: false,
      });
    }
    // const isPasswordSame = await comparePassword(password, isExists.password);
    // if (!isPasswordSame) {
    //   return Response.json({
    //     message: "Password is incorrect",
    //     success: false,
    //   });
    // }
    const token = sign(
      {
        id: isExists._id,
        role: isExists.role,
        name: isExists.name,
        email: isExists.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );
    cookieStore.set("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });
    return Response.json({
      message: "User logged in successfully",
      success: true,
      data: {
        name: isExists.name,
        email: isExists.email,
        role: isExists.role,
        id: isExists._id,
      },
    });
  } catch (error) {
    const err = error as Error & { message: string; success: boolean };
    return Response.json({ message: err.message, success: false });
  }
}
