import { UserRoles } from "@/lib/consts";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/utils";
import { faker } from "@faker-js/faker";

export async function POST(req: Request, res: Response) {
  const { firstName, lastName, email, password } = await req.json();
  try {
    const { db } = await connectToDatabase();
    const isExists = await db.collection("users").findOne({ email });
    if (isExists) {
      return Response.json({
        message: "User already exists",
        success: false,
      });
    }
    const hashedPassword = await hashPassword(password);
    const username = email.split("@")[0];
    const avatar = faker.image.urlPicsumPhotos({
      width: 100,
      height: 100,
    });
    const user = await db.collection("users").insertOne({
      username,
      name: `${firstName} ${lastName || ""}`,
      email,
      avatar,
      password: hashedPassword,
      role: UserRoles.USER,
      createdAt: new Date(),
    });
    return Response.json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    const err = error as Error & { message: string; success: boolean };
    return Response.json({ message: err.message, success: false });
  }
}
