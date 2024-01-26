"use client";

import { PropertyTypeEnum } from "@/lib/consts";
import { cn } from "@/lib/utils";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  // Button,
  useDisclosure,
} from "@nextui-org/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC, useEffect } from "react";
import toast from "react-hot-toast";
import { useGlobalContext } from "./context-provider";
import { Button } from "./ui/button";

type Props = {};

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Hostel & PG's",
    href: "/search?property-type=" + PropertyTypeEnum[0].replace("/", "-"),
  },
  {
    name: "Hotel",
    href: "/search?property-type=" + PropertyTypeEnum[1],
  },
  {
    name: "Homestays",
    href: "/search?property-type=" + PropertyTypeEnum[2].replace(" ", "+"),
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "FAQ's",
    href: "/faqs",
  },
];

const Navbar: FC = (props: Props) => {
  const { user, setUser } = useGlobalContext();

  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isLoadingUser, setIsLoadingUser] = React.useState<boolean>(true);
  // const [user, setUser] = React.useState<null | any>(null); // [TODO - 1] - Add user type
  const [loginType, setLoginType] = React.useState<"login" | "signup">("login");

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setLoginType("login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string; succes: boolean };
      console.log(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(user, "user");
  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setUser(data?.data);
        onOpenChange();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string; succes: boolean };
      console.log(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setUser(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string; succes: boolean };
      console.log(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      setIsLoadingUser(true);
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data?.data);
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };
    getUser();
  }, []);

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-[99] mx-auto max-w-screen-2xl bg-white bg-opacity-60 backdrop-blur-lg",
          pathname === "/" && "relative",
        )}
      >
        <div className="flex items-center justify-between border-b px-5 backdrop-blur-sm sm:px-10">
          <Link href="/" className="py-7 font-sora font-semibold sm:py-5">
            Rofabs
          </Link>
          <div className="hidden items-center justify-center gap-2.5 py-5 sm:flex">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "rounded-md px-2 py-1.5 font-rubik text-sm font-medium duration-100 hover:bg-zinc-100",
                  pathname === link.href && "bg-zinc-100",
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-end">
            {user && user !== null ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <div className="flex cursor-pointer items-center gap-3 rounded-[99px] bg-zinc-100 p-2.5">
                    <Avatar
                      isBordered
                      as="button"
                      className="border-zinc-200 font-medium transition-transform"
                      name={user?.name.toUpperCase()}
                      size="sm"
                      src={"https://picsum.photos/seed/NWbJM2B/640/480"}
                    />
                    <div className="flex flex-col items-start justify-center">
                      <p className="text-xs font-semibold">{user?.name}</p>
                      <p className="text-xs font-medium text-zinc-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{user?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="profile_link">Profile</DropdownItem>
                  <DropdownItem key="bookings_link">Bookings</DropdownItem>
                  {/* <DropdownItem key="billing">Billing</DropdownItem> */}
                  <DropdownItem key="preferences">Preferences</DropdownItem>
                  <DropdownItem
                    onClick={handleLogout}
                    key="logout"
                    color="danger"
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button
                onClick={onOpen}
                variant={"outline"}
                className={cn(
                  "rounded-lg",
                  isLoadingUser && "cursor-not-allowed opacity-50",
                )}
              >
                {isLoadingUser && (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                )}
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
      <Modal
        classNames={{
          backdrop: "z-[899]",
          wrapper: "z-[900]",
        }}
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="font-rubik text-2xl font-bold">
                  {loginType === "login" ? "Login" : "Sign Up"}
                </span>
                <span className="font-rubik text-sm font-medium text-zinc-600">
                  {loginType === "login"
                    ? "Login to your account"
                    : "Create an account"}
                </span>
              </ModalHeader>
              <ModalBody>
                {loginType === "signup" && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Input
                      label="First Name"
                      placeholder="Enter your first name"
                      labelPlacement="outside"
                      classNames={{
                        inputWrapper: "rounded-lg border shadow-none",
                        base: "font-rubik font-medium text-black text-sm",
                      }}
                      value={firstName}
                      onValueChange={setFirstName}
                    />
                    <Input
                      label="Last Name"
                      placeholder="Enter your last name"
                      labelPlacement="outside"
                      classNames={{
                        inputWrapper: "rounded-lg border shadow-none",
                        base: "font-rubik font-medium text-black text-sm",
                      }}
                      value={lastName}
                      onValueChange={setLastName}
                    />
                  </div>
                )}
                <Input
                  type="email"
                  label="Email"
                  placeholder="Enter your email address"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper: "rounded-lg border shadow-none",
                    base: "font-rubik font-medium text-black text-sm",
                  }}
                  value={email}
                  onValueChange={setEmail}
                />
                <Input
                  type="password"
                  label="password"
                  placeholder="Enter your password"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper: "rounded-lg border shadow-none",
                    base: "font-rubik font-medium text-black text-sm",
                  }}
                  value={password}
                  onValueChange={setPassword}
                />
                {loginType === "signup" && (
                  <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="Enter your password again"
                    labelPlacement="outside"
                    classNames={{
                      inputWrapper: "rounded-lg border shadow-none",
                      base: "font-rubik font-medium text-black text-sm",
                    }}
                    value={confirmPassword}
                    onValueChange={setConfirmPassword}
                  />
                )}
                {loginType === "login" && (
                  <div className="flex items-center justify-end py-2">
                    <Link
                      className="text-sm font-medium text-zinc-600"
                      href="/forgot-password"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                )}
                {loginType === "login" && (
                  <button
                    onClick={handleLogin}
                    className={cn(
                      "flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-3.5 font-rubik font-bold text-white duration-100 hover:bg-rose-600 active:scale-95 active:bg-rose-500",
                      isLoading && "cursor-not-allowed opacity-50",
                    )}
                  >
                    {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                    Login
                  </button>
                )}
                {loginType === "signup" && (
                  <button
                    onClick={handleSignup}
                    className={cn(
                      "flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-3.5 font-rubik font-bold text-white duration-100 hover:bg-rose-600 active:scale-95 active:bg-rose-500",
                      isLoading && "cursor-not-allowed opacity-50",
                    )}
                  >
                    {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                    Sign Up
                  </button>
                )}

                {loginType === "login" && (
                  <div className="flex items-center justify-center py-2">
                    <span className="text-sm font-medium text-zinc-600">
                      Don&apos;t have an account?
                    </span>
                    <button
                      className="ml-1 text-sm font-medium text-rose-500"
                      onClick={() => setLoginType("signup")}
                    >
                      Sign Up
                    </button>
                  </div>
                )}
                {loginType === "signup" && (
                  <div className="flex items-center justify-center py-2">
                    <span className="text-sm font-medium text-zinc-600">
                      Already have an account?
                    </span>
                    <button
                      className="ml-1 text-sm font-medium text-rose-500"
                      onClick={() => setLoginType("login")}
                    >
                      Login
                    </button>
                  </div>
                )}
              </ModalBody>

              {/* <ModalFooter>
                <Button variant={"outline"} onClick={onClose}>
                  Close
                </Button>
                <Button variant={"default"} onClick={onClose}>
                  Action
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;
