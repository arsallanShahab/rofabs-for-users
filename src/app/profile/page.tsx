"use client";
import { useGlobalContext } from "@/components/context-provider";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  updateProfile,
} from "firebase/auth";
import { Loader2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import OTPInput from "react-otp-input";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

const Page = () => {
  const { user } = useGlobalContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isLoadingUser, setIsLoadingUser] = React.useState<boolean>(true);
  const [loginType, setLoginType] = React.useState<"login" | "signup">("login");

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [otp, setOtp] = React.useState<string>("");
  const [actionStep, setActionStep] = React.useState<number>(1);
  const [confirmationResult, setConfirmationResult] =
    React.useState<ConfirmationResult | null>();

  const handleGetOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // setActionStep(2);
    // return;
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          setActionStep(2);
        },
      },
    );

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + phoneNumber,
        recaptchaVerifier,
      );
      console.log(confirmationResult, "confirmationResult");
      setConfirmationResult(confirmationResult);
      toast.success("OTP sent successfully");
      // if (otp) {
      //   await confirmationResult.confirm(otp);
      //   console.log("Successfully signed in with phone number.");
      // } else {
      //   console.log("Verification code not provided.");
      // }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error("Error signing in with phone number: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setIsLoading(true);
      await confirmationResult?.confirm(otp).then((result) => {
        console.log(result.user, "result user");
      });
      toast.success("OTP verified successfully");
      if (loginType === "signup") {
        setActionStep(3);
      } else {
        onOpenChange();
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
    if (auth.currentUser === null) {
      toast.error("User not found");
      return;
    }
    try {
      setIsLoading(true);
      const res = updateProfile(auth.currentUser, {
        displayName: firstName + " " + lastName,
        photoURL: "https://picsum.photos/seed/NWbJM2B/640/480",
        // email: email,
      });
      const addToMongoDB = await fetch("/api/auth/mongodb/add-user", {
        method: "POST",
        body: JSON.stringify({
          id: auth.currentUser.uid,
          name: firstName + " " + lastName,
          phoneNumber: phoneNumber,
          avatar: "https://picsum.photos/seed/NWbJM2B/640/480",
        }),
      });
      const mongodbData = await addToMongoDB.json();
      console.log(mongodbData, "mongodbData");
      const data = await res;
      console.log(data, "data");
      toast.success("Profile updated successfully");
      onOpenChange();
    } catch (error) {
      const err = error as Error & { message: string; succes: boolean };
      console.log(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <>
      <div className="min-h-screen bg-blue-50 p-5">
        <div className="grid h-full w-full grid-cols-1 items-start gap-5">
          {" "}
          <h3 className="font-rubik text-2xl font-medium text-black">
            Profile
          </h3>
          {!user && (
            <div className="grid gap-5 rounded-2xl bg-white p-4">
              <p className="font-rubik text-sm font-medium text-black">
                Please Login to see your profile
              </p>
              <button
                onClick={onOpen}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-2.5 font-rubik font-bold text-white duration-100 hover:bg-rose-600 active:scale-95 active:bg-rose-500"
              >
                Login
              </button>
            </div>
          )}
          {user && (
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
          )}
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
                      </>
                    )}
                  </div>
                )}
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
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Page;
