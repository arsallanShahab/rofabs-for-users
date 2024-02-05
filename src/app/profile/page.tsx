"use client";
import { useGlobalContext } from "@/components/context-provider";
import Wrapper from "@/components/wrapper";
import { Input, useDisclosure } from "@nextui-org/react";

import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { user, isLoadingUser, setUser, isOpen, onOpen, onOpenChange } =
    useGlobalContext();
  const [edit, setEdit] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (user?.name && user?.email && user?.phoneNumber) {
      setName(user.name);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUser(null);
      router.push("/");
    } catch (error) {
      toast.error("An error occurred. Please try again later");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch("/api/auth/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setEdit(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later");
    }
  };

  if (isLoadingUser)
    return (
      <Wrapper>
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-950" />
        </div>
      </Wrapper>
    );

  return (
    <>
      <Wrapper>
        <div className="flex items-center justify-between">
          <h3
            onClick={() => router.back()}
            className="flex cursor-pointer items-center justify-start gap-1 rounded-xl p-2.5 pr-4 font-rubik text-2xl font-medium text-black duration-100 hover:bg-zinc-100 active:-translate-x-2 active:scale-95 active:bg-zinc-50 sm:text-4xl"
          >
            <ChevronLeft
              size={24}
              className="h-6 w-6 stroke-[3px] sm:h-8 sm:w-8"
            />
            Profile
          </h3>
          {user?.id && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-rose-500 px-7 py-2.5 font-rubik text-sm text-white duration-100 hover:bg-rose-600 active:scale-95 active:bg-rose-500"
            >
              Log Out
            </button>
          )}
        </div>
        <div className="grid h-full w-full grid-cols-1 items-start gap-5">
          {!user && (
            <div className="grid gap-5 rounded-2xl bg-white p-4">
              <p className="font-rubik text-sm font-medium text-black">
                Please Login to see your profile
              </p>
              <button
                onClick={onOpen}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-rose-500 py-2.5 font-rubik text-sm text-white duration-100 hover:bg-rose-600 active:scale-95 active:bg-rose-500"
              >
                Login
              </button>
            </div>
          )}
          {user && <div className=""></div>}
          {user && (
            <div className="grid gap-5 rounded-2xl border bg-white p-4 shadow-sm sm:grid-cols-3">
              {" "}
              <Input
                label="Name"
                labelPlacement="outside"
                // variant="bordered"
                classNames={{
                  inputWrapper: "rounded-lg border shadow-none",
                  base: "font-rubik font-medium text-black text-sm",
                }}
                isDisabled={!edit}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                labelPlacement="outside"
                // variant="bordered"
                classNames={{
                  inputWrapper: "rounded-lg border shadow-none",
                  base: "font-rubik font-medium text-black text-sm",
                }}
                isDisabled={!edit}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Phone Number"
                labelPlacement="outside"
                // variant="bordered"
                classNames={{
                  inputWrapper: "rounded-lg border shadow-none",
                  base: "font-rubik font-medium text-black text-sm",
                }}
                isDisabled={!edit}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {!edit && (
                <div
                  onClick={() => setEdit(!edit)}
                  className="h-full w-full sm:col-span-3 sm:flex sm:justify-end"
                >
                  <button className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-500 px-10 py-2.5 font-rubik text-sm text-white duration-100 hover:bg-indigo-600 active:scale-95 active:bg-indigo-500">
                    Edit
                  </button>
                </div>
              )}
              {edit && (
                <div className="flex items-center justify-end gap-5 sm:col-span-3">
                  <button
                    onClick={() => setEdit(!edit)}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-gray-500 px-10 py-2.5 font-rubik text-sm text-white duration-100 hover:bg-gray-600 active:scale-95 active:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-green-500 px-10 py-2.5 font-rubik text-sm text-white duration-100 hover:bg-green-600 active:scale-95 active:bg-green-500"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
};

export default Page;
