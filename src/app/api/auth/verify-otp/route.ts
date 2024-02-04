import { connectToDatabase } from "@/lib/mongodb";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request, res: Response) {
  const { phoneNumber, otp } = await req.json();
  const cookieStore = cookies();
  try {
    const { db } = await connectToDatabase();
    const user = await db
      .collection("users")
      .findOne({ phoneNumber, otp: parseInt(otp) });
    console.log(user, "user");
    if (!user) {
      return Response.json({ message: "Invalid OTP", success: false });
    }
    // if (!user?.name) {
    //   return Response.json({
    //     message: "Please signup first",
    //     success: false,
    //   });
    // }
    const res = await db.collection("users").updateOne(
      { phoneNumber },
      {
        $set: {
          otp: null,
          verifiedAt: new Date(),
        },
      },
    );
    if (user?.name || user?.email) {
      const token = sign(
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
      cookieStore.set("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24,
      });
      return Response.json({
        message: "User logged in successfully",
        success: true,
        data: {
          phoneNumber: user.phoneNumber,
          name: user.name,
          email: user.email,
          role: user.role,
          id: user._id,
          profilePicture: user.profilePicture,
        },
      });
    }
    return Response.json({
      message: "OTP verified successfully",
      success: true,
    });
  } catch (error) {
    return Response.json({ message: "Failed to verify OTP", success: false });
  }
}
