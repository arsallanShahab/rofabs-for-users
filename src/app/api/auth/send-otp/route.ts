import { connectToDatabase } from "@/lib/mongodb";

async function sendOTP(phoneNumber: number, OTP: number) {
  const apiKey = process.env.FAST2SMS_API as string;
  console.log(phoneNumber, OTP, "phoneNumber, OTP");
  try {
    const res = await fetch(
      `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&variables_values=${OTP}&route=otp&numbers=${phoneNumber}`,
      {
        method: "GET",
        headers: {
          "cache-control": "no-cache",
        },
      },
    );
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function POST(req: Request) {
  const { phoneNumber } = await req.json();
  try {
    // Add or update OTP in MongoDB
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ phoneNumber });
    console.log(user, "user");
    const otp = Math.floor(100000 + Math.random() * 900000);
    const response = await sendOTP(phoneNumber, otp);
    const data = await response.json();
    console.log(data, "data");
    if (!data.return) {
      return Response.json({
        message: data?.message || "Failed to send otp",
        success: false,
      });
    }

    if (!user) {
      await db.collection("users").insertOne({
        phoneNumber,
        otp,
        createdAt: new Date(),
      });
    } else {
      await db.collection("users").updateOne(
        { phoneNumber },
        {
          $set: {
            otp,
            createdAt: new Date(),
          },
        },
        { upsert: true },
      );
    }

    console.log(data, "data");
    return Response.json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    return Response.json({
      message: "Failed to send OTP",
      success: false,
      error,
    });
  }
}
