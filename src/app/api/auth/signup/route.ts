import { UserRoles } from "@/lib/consts";
import { connectToDatabase } from "@/lib/mongodb";
import { faker } from "@faker-js/faker";

export async function POST(req: Request, res: Response) {
  const { phoneNumber, firstName, lastName, email } = await req.json();
  try {
    const { db } = await connectToDatabase();
    const isExists = await db.collection("users").findOne({ phoneNumber });
    // if (isExists) {
    //   return Response.json({
    //     message: "User already exists",
    //     success: false,
    //   });
    // }
    // const hashedPassword = await hashPassword(password);
    // const username = email.split("@")[0];
    const username = firstName.toLowerCase() + lastName.toLowerCase();
    const avatar = faker.image.urlPicsumPhotos({
      width: 100,
      height: 100,
    });
    const user = await db.collection("users").updateOne(
      { phoneNumber },
      {
        $set: {
          name: `${firstName}${lastName.length > 0 ? " " + lastName : ""}`,
          email,
          username,
          profilePicture: avatar,
          role: UserRoles.USER,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
    return Response.json({
      message: "User updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    const err = error as Error & { message: string; success: boolean };
    return Response.json({ message: err.message, success: false });
  }
}
