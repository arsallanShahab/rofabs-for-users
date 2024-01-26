import { UserRoles } from "@/lib/consts";
import { connectToDatabase } from "@/lib/mongodb";
import { comparePassword, hashPassword } from "@/lib/utils";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request, res: Response) {
  const cookieStore = cookies();
  cookieStore.delete("token");
  return Response.json({
    message: "User logged out successfully",
    success: true,
    data: null,
  });
}
