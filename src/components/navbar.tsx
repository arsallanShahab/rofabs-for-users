"use client";
import { auth } from "@/lib/firebase";
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
  ModalHeader,
  // Button,
  useDisclosure,
} from "@nextui-org/react";
import { Bell, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect } from "react";
import toast from "react-hot-toast";
import OTPInput from "react-otp-input";
import { useGlobalContext } from "./context-provider";
import { Button } from "./ui/button";
const links = [
  {
    name: "Home",
    href: "/",
  },
  // {
  //   name: "Hostel & PG's",
  //   href: "/search?property-type=" + PropertyTypeEnum[0].replace("/", "-"),
  // },
  // {
  //   name: "Hotel",
  //   href: "/search?property-type=" + PropertyTypeEnum[1],
  // },
  // {
  //   name: "Homestays",
  //   href: "/search?property-type=" + PropertyTypeEnum[2].replace(" ", "+"),
  // },
  {
    name: "Cities",
    href: "/cities",
  },

  {
    name: "Contact Us",
    href: "/contact",
  },
  {
    name: "About Us",
    href: "/about",
  },
  {
    name: "FAQ's",
    href: "/faqs",
  },
];
const Navbar: FC = () => {
  const {
    user,
    setUser,
    isLoadingUser,
    setIsLoadingUser,
    isOpen,
    onOpen,
    onOpenChange,
  } = useGlobalContext();
  const pathname = usePathname();

  const router = useRouter();

  // const [isLoadingUser, setIsLoadingUser] = React.useState<boolean>(true);
  const [loginType, setLoginType] = React.useState<"login" | "signup">("login");

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [otp, setOtp] = React.useState<string>("");
  const [actionStep, setActionStep] = React.useState<number>(1);

  const handleGetOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await res.json();
      if (data.success) {
        setActionStep(2);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      const data = await res.json();
      if (!data.success) {
        return toast.error(data.message);
      }

      if ((!data?.data?.name || !data?.data?.email) && loginType === "login") {
        setLoginType("signup");
        setActionStep(3);
        toast.error("Please sign up first");
        return;
      }
      if (data?.success) {
        if (loginType === "signup") {
          setOtp("");
          return setActionStep(3);
        }
        toast.success(data?.message);
        setUser(data?.data);
        onOpenChange();
        setOtp("");
        setPhoneNumber("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setActionStep(1);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      console.error("Error signing in with phone number: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, firstName, lastName, email }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success(data?.message);
        setUser(data?.user);
        onOpenChange();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string; succes: boolean };
      console.log(err);
      toast.error(err?.message);
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
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className={cn(
          "relative top-0 z-[99] mx-auto max-w-screen-2xl bg-white bg-opacity-60 backdrop-blur-lg sm:block",
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
          <div className="block rounded-lg bg-zinc-100 p-2 sm:hidden">
            <Bell className="h-5 w-5" />
          </div>
          <div className="hidden items-center justify-end sm:flex">
            {user && user !== null ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <div className="flex cursor-pointer items-center gap-3 rounded-[99px] bg-zinc-100 p-2.5">
                    <Avatar
                      isBordered
                      as="button"
                      className="border-zinc-200 font-medium transition-transform"
                      name={user?.name?.toUpperCase()}
                      size="sm"
                      src={user?.profilePicture}
                    />
                    <div className="flex flex-col items-start justify-center">
                      <p className="text-xs font-semibold">{user?.name}</p>
                      <p className="text-xs font-medium text-zinc-600">
                        {user?.phoneNumber}
                      </p>
                    </div>
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{user?.email}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="profile_link"
                    onClick={(e) => router.push("/profile")}
                  >
                    Profile
                  </DropdownItem>
                  <DropdownItem
                    onClick={(e) => router.push("/bookings/me")}
                    key="bookings_link"
                  >
                    Bookings
                  </DropdownItem>
                  {/* <DropdownItem key="billing">Billing</DropdownItem> */}
                  {/* <DropdownItem key="preferences">Preferences</DropdownItem> */}
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
                variant={"default"}
                className={cn(
                  "rounded-lg bg-sky-500 px-6 font-rubik text-xs font-medium",
                  isLoadingUser && "cursor-not-allowed opacity-50",
                )}
              >
                {isLoadingUser && (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                )}
                LOGIN
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
        onClose={() => {
          setActionStep(1);
          setOtp("");
          setPhoneNumber("");
          setFirstName("");
          setLastName("");
          setLoginType("login");
        }}
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
                <Input
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper: "rounded-lg border shadow-none",
                    base: "font-rubik font-medium text-black text-sm col-span-2",
                  }}
                  value={phoneNumber}
                  onValueChange={setPhoneNumber}
                />
                {actionStep === 1 && (
                  <>
                    <div id="recaptcha-container"></div>
                  </>
                )}
                {actionStep === 2 && (
                  <div className="relative col-span-2 flex w-full justify-center px-5 py-2.5">
                    <OTPInput
                      value={otp}
                      inputType="number"
                      placeholder="000000"
                      // type="number"
                      onChange={setOtp}
                      numInputs={6}
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => (
                        <input
                          {...props}
                          style={{ width: "3rem", height: "3rem" }}
                          className="rounded-md border p-4 text-center text-base"
                        />
                      )}
                    />
                  </div>
                )}
                {actionStep === 1 && (
                  <button
                    onClick={handleGetOtp}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-3.5 font-rubik font-bold text-white duration-100 hover:bg-rose-600 active:scale-95 active:bg-rose-500"
                  >
                    {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                    Send OTP
                  </button>
                )}
                {actionStep === 2 && (
                  <button
                    onClick={handleVerifyOTP}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-3.5 font-rubik font-bold text-white duration-100 hover:bg-rose-600 active:scale-95 active:bg-rose-500"
                  >
                    {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                    Verify OTP
                  </button>
                )}
                {loginType === "signup" && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="col-span-2 grid gap-2.5"></div>
                    {actionStep === 3 && (
                      <>
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
                        <Input
                          label="Email"
                          placeholder="Enter your email"
                          labelPlacement="outside"
                          classNames={{
                            inputWrapper: "rounded-lg border shadow-none",
                            base: "font-rubik font-medium text-black text-sm col-span-2",
                          }}
                          value={email}
                          onValueChange={setEmail}
                        />
                      </>
                    )}
                  </div>
                )}
                {/* {loginType === "login" && (
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
                )} */}
                {loginType === "signup" && actionStep === 3 && (
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
                      onClick={() => {
                        setLoginType("signup");
                        setActionStep(1);
                      }}
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
                      onClick={() => {
                        setLoginType("login");
                        setActionStep(1);
                      }}
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
