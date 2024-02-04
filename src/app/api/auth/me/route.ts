import { UserRoles } from "@/lib/consts";
import { connectToDatabase } from "@/lib/mongodb";
import { comparePassword, hashPassword } from "@/lib/utils";
import { JwtPayload, VerifyErrors, sign, verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
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
    const verifyToken = verify(
      token.value,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    console.log(verifyToken, "verifyToken");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(verifyToken.id) });
    if (!user) {
      return Response.json({
        message: "User not found",
        success: false,
        data: null,
      });
    }

    const signedToken = sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );
    cookieStore.set("token", signedToken, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });

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
