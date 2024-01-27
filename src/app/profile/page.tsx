"use client";
import { useGlobalContext } from "@/components/context-provider";
import { auth } from "@/lib/firebase";
import { Input } from "@nextui-org/react";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

const Page = () => {
  const { user } = useGlobalContext();
  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = signOut(auth);
    } catch (error) {
      const err = error as Error & { message: string; succes: boolean };
      console.log(err);
      toast.error(err.message);
    }
  };
  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50 p-5">
        <h3 className="font-rubik text-2xl font-medium text-black">Profile</h3>
        <div className="grid gap-5 rounded-2xl bg-white p-4">
          <p className="font-rubik text-sm font-medium text-black">
            Please Login to see your profile
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-blue-50 p-5">
      <div className="grid h-full w-full grid-cols-1 items-start gap-5">
        {" "}
        <h3 className="font-rubik text-2xl font-medium text-black">Profile</h3>
        <div className="grid gap-5 rounded-2xl bg-white p-4">
          {" "}
          <Input
            label="Name"
            labelPlacement="outside"
            // variant="bordered"
            classNames={{
              inputWrapper: "rounded-lg border shadow-none",
              base: "font-rubik font-medium text-black text-sm",
            }}
            value={user?.displayName || ""}
          />
          <Input
            label="Phone Number"
            labelPlacement="outside"
            // variant="bordered"
            classNames={{
              inputWrapper: "rounded-lg border shadow-none",
              base: "font-rubik font-medium text-black text-sm",
            }}
            value={user?.phoneNumber || ""}
          />
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-2.5 font-rubik font-bold text-white duration-100 hover:bg-rose-600 active:scale-95 active:bg-rose-500"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
