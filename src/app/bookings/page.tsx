"use client";
import { useGlobalContext } from "@/components/context-provider";
import { PropertyTypeEnum } from "@/lib/consts";
import { cn } from "@/lib/utils";
import { Input } from "@nextui-org/react";
import { differenceInDays } from "date-fns";
import { Loader2, Star } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Property, Room } from "../search/types";

declare global {
  interface Window {
    Razorpay: {} | any;
  }
}

const Page: FC = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [creatingBooking, setCreatingBooking] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [propertyId, setPropertyId] = useState<string>();
  const [roomId, setRoomId] = useState<string>();
  const [numberOfGuests, setNumberOfGuests] = useState<number | string>(0);
  const [checkInDate, setCheckInDate] = useState<string | Date>();
  const [checkOutDate, setCheckOutDate] = useState<string | Date>();
  const [selectedState, setSelectedState] = useState<string>();
  const [amount, setAmount] = useState<number>(0);
  const [property, setProperty] = useState<Property>();
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    if (params.has("property-id")) {
      setPropertyId(params.get("property-id")?.toString());
    } else {
      router.push("/search");
    }
    if (params.has("room-id")) {
      setRoomId(params.get("room-id")?.toString());
    } else {
      router.push("/rooms?property-id=" + searchParams.get("property-id"));
    }
    if (params.has("check-in")) {
      setCheckInDate(params.get("check-in")?.toString());
    }
    if (params.has("check-out")) {
      setCheckOutDate(params.get("check-out")?.toString());
    }
    if (params.has("no-of-guests")) {
      setNumberOfGuests(Number(params.get("no-of-guests")?.toString()));
    }
    if (params.has("state")) {
      setSelectedState(params.get("state")?.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/bookings?property-id=${propertyId}&room-id=${roomId}`,
        );
        const data = await res.json();
        setProperty(data.property);
        setRoom(data.room);
        if (data.room.pricePerMonth && numberOfGuests != 0) {
          setAmount(
            data.room.pricePerMonth * parseInt(numberOfGuests.toString()),
          );
        } else if (data.room.pricePerDay && checkInDate && checkOutDate) {
          setAmount(
            data.room.pricePerDay *
              differenceInDays(new Date(checkOutDate), new Date(checkInDate)),
          );
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId && roomId) {
      fetchRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, propertyId]);

  const createQueryString = (
    paramsToUpdate: Record<string, string>,
    paramToRemove?: string,
  ) => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(paramsToUpdate).forEach(([name, value]) => {
      params.set(name, value);
    });
    if (paramToRemove) {
      params.delete(paramToRemove);
    }
    return params.toString();
  };
  const handlePay = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!user || !user.uid) {
      toast.error("Please Login to continue");
      return;
    }
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }
    if (!phoneNumber || !email || !firstName) {
      toast.error("Please fill the guest details");
      return;
    }
    if (firstName.length < 3) {
      toast.error("Please enter a valid first name");
      return;
    }
    if (!email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!phoneNumber.match(/^[0-9]{10}$/)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setCreatingBooking(true);
    // const t = toast.loading("Creating order");
    const res = await fetch("/api/bookings/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomType: room?.roomType,
        roomCategory: room?.roomCategory,
        from: new Date(checkInDate),
        to: new Date(checkOutDate),
        numberOfGuests: numberOfGuests,
        guestName: firstName + " " + lastName || "",
        guestEmail: email,
        guestPhoneNumber: phoneNumber,
        propertyId: propertyId,
        roomId: roomId,
        amount,
        userId: user.uid,
      }),
    });
    // toast.dismiss(t);
    toast.success("Order created");
    toast.success("pay to confirm booking");
    const data = await res.json();
    setCreatingBooking(false);
    const razorpay = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      order_id: data.id,
      amount: data.amount,
      handler: (res: any) => {
        console.log(res, "res");
        toast.success("Payment Successful");
      },
      prefill: {
        name: data.notes.guestName,
        email: data.notes.guestEmail,
        contact: data.notes.guestPhoneNumber,
      },
      notes: {
        guestName: data.notes.guestName,
        guestPhoneNumber: data.notes.guestPhoneNumber,
        guestEmail: data.notes.guestEmail,
        from: data.notes.from.toString(),
        to: data.notes.to.toString(),
        numberOfGuests: data.notes.numberOfGuests,
        roomType: data.notes.roomType,
        roomCategory: data.notes.roomCategory,
        propertyId: data.notes.propertyId,
        userId: data.notes.userId,
        orderId: data.orderId,
      },
    });
    razorpay.open();
  };
  if (loading || !property || !room) {
    return (
      <div className="relative min-h-screen w-full bg-white">
        <div className="relative z-10 mx-auto grid max-w-screen-xl grid-cols-6 gap-5 p-5 pb-16">
          <div className="col-span-4 h-96 w-full animate-pulse rounded-xl bg-blue-200"></div>
          <div className="col-span-2 h-96 w-full animate-pulse rounded-xl bg-amber-200"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative min-h-screen w-full bg-blue-50">
      <div className="relative z-10 mx-auto grid max-w-screen-xl grid-cols-6 gap-5 p-3 pb-16 sm:p-5">
        <div className="col-span-6 flex w-full flex-col gap-5 *:w-full sm:col-span-4">
          <div className="rounded-xl border bg-white">
            <div className="border-b px-5 py-5 sm:px-7">
              <h3 className="font-rubik text-xl font-semibold">Hotel Info</h3>
            </div>
            <div className="px-3 py-5 sm:px-5">
              {property && (
                <div className="flex justify-start gap-5">
                  <Image
                    src={property?.images[0].url}
                    alt={property?.name}
                    width={500}
                    height={500}
                    className="h-44 w-44 rounded-lg object-cover"
                  />
                  <div className="flex flex-col items-start justify-center gap-1.5">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => {
                        return (
                          <Star
                            key={index}
                            className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                          />
                        );
                      })}
                    </div>
                    <h3 className="font-rubik text-xl font-semibold">
                      {property?.name}
                    </h3>
                    <p className="max-w-sm font-rubik text-sm font-light text-zinc-500">
                      {property?.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 pt-0 sm:p-5 sm:pt-0">
              <div className="flex w-full flex-wrap items-center justify-start rounded-xl bg-blue-100 *:flex-1 *:flex-col *:items-start *:justify-center">
                <div className="p-5">
                  <span className="font-rubik text-xs font-medium">
                    Check-In
                  </span>
                  <span className="text-md block font-rubik font-medium">
                    {checkInDate &&
                      new Date(checkInDate).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </span>
                </div>
                <div className="p-5">
                  <span className="font-rubik text-xs font-medium">
                    Check-Out
                  </span>
                  <span className="text-md block font-rubik font-medium">
                    {checkOutDate &&
                      new Date(checkOutDate).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </span>
                </div>
                {property?.type === PropertyTypeEnum[0] && (
                  <div className="p-5">
                    <span className="font-rubik text-xs font-medium">
                      Number of Guests
                    </span>
                    <span className="text-md block font-rubik font-medium">
                      {numberOfGuests && numberOfGuests} Guests
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 pt-0 sm:p-5 sm:pt-0">
              {room && (
                <div className="rounded-xl bg-blue-100 p-5">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center justify-start gap-2">
                      <h3 className="font-rubik text-lg font-semibold">Room</h3>
                      <span className="font-rubik text-sm font-medium">
                        ({room.roomType} {room.roomCategory} Room)
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {property?.type === PropertyTypeEnum[2] ? (
                        <h3 className="font-rubik text-lg font-semibold">
                          ₹{room?.pricePerDay + "/Day"}
                        </h3>
                      ) : (
                        <h3 className="font-rubik text-lg font-semibold">
                          ₹
                          {room?.pricePerMonth *
                            parseInt(numberOfGuests.toString()) +
                            "/Month"}
                        </h3>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="rounded-xl border bg-white">
            <div className="border-b px-5 py-5 sm:px-7">
              <h3 className="font-rubik text-xl font-semibold">
                Guest Details
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2 sm:px-7">
              <Input
                label="First Name"
                placeholder="Enter First Name"
                labelPlacement="outside"
                // variant="bordered"
                classNames={{
                  inputWrapper: "rounded-lg border shadow-none",
                  base: "font-rubik font-medium text-black text-sm",
                }}
                size="lg"
                value={firstName}
                onValueChange={setFirstName}
              />
              <Input
                label="Last Name"
                placeholder="Enter Last Name"
                labelPlacement="outside"
                // variant="bordered"
                classNames={{
                  inputWrapper: "rounded-lg border shadow-none",
                  base: "font-rubik font-medium text-black text-sm",
                }}
                size="lg"
                value={lastName}
                onValueChange={setLastName}
              />
              <Input
                type="email"
                inputMode="email"
                label="Email"
                placeholder="Enter Email"
                labelPlacement="outside"
                // variant="bordered"
                classNames={{
                  inputWrapper: "rounded-lg border shadow-none",
                  base: "font-rubik font-medium text-black text-sm",
                }}
                size="lg"
                value={email}
                onValueChange={setEmail}
              />
              <Input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                onWheel={(e) => e.currentTarget.blur()}
                label="Phone Number"
                placeholder="Enter Phone Number"
                labelPlacement="outside"
                // variant="bordered"
                classNames={{
                  inputWrapper: "rounded-lg border shadow-none",
                  base: "font-rubik font-medium text-black text-sm",
                }}
                size="lg"
                value={phoneNumber}
                onValueChange={setPhoneNumber}
              />
            </div>
          </div>
          {/* <div className="rounded-xl bg-white">
            <div className="border-b px-7 py-5">
              <h3 className="font-rubik text-xl font-semibold">
                Billing Details
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-5 px-7 py-5">
              <Input
                label="Billing Address"
                placeholder="Enter Billing Address"
                labelPlacement="outside"
                variant="bordered"
                classNames={{
                  inputWrapper: "rounded-md",
                  base: "font-rubik font-medium text-black text-sm",
                }}
              />
              <Input
                type="number"
                inputMode="numeric"
                label="Pincode"
                placeholder="Enter Pincode"
                labelPlacement="outside"
                variant="bordered"
                classNames={{
                  inputWrapper: "rounded-md",
                  base: "font-rubik font-medium text-black text-sm",
                }}
              />
              <Select
                label="State"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Select State"
                classNames={{
                  base: "font-rubik font-medium text-black text-sm",
                  trigger: "rounded-md",
                }}
                selectedKeys={[selectedState || ""]}
                onChange={(e) => {
                  setSelectedState(e.target.value.toString());
                }}
              >
                {ListOfStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div> */}
          <div>
            <button
              onClick={handlePay}
              className={cn(
                "flex w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-5 font-rubik text-lg font-medium text-white duration-100 hover:bg-orange-600 active:scale-95 active:bg-orange-500",
                creatingBooking && "cursor-not-allowed opacity-50",
              )}
            >
              {creatingBooking && (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              )}
              Proceed to Pay ₹{amount}
            </button>
            <span className="text-left font-rubik text-xs text-zinc-500">
              By proceeding, I agree to Rofabs&apos;s Privacy Policy, User
              Agreement & Terms of Service
            </span>
          </div>
        </div>
        <div className="col-span-6 sm:col-span-2">
          <div className="sticky top-24">
            <div className="rounded-xl border bg-white">
              <div className="border-b px-7 py-5">
                <h3 className="font-rubik text-xl font-semibold">
                  Price Summary
                </h3>
              </div>
              <div className="px-7 py-5">
                <div className="flex items-center justify-between py-3">
                  <span className="font-rubik text-sm">Room Charges</span>
                  {room && property?.type === PropertyTypeEnum[2] ? (
                    <h3 className="font-rubik text-sm">
                      ₹{room?.pricePerDay + "/Day"}
                    </h3>
                  ) : (
                    <h3 className="font-rubik text-sm">
                      ₹
                      {room?.pricePerMonth *
                        parseInt(numberOfGuests.toString()) +
                        "/Month"}
                    </h3>
                  )}
                </div>
                {property.type === PropertyTypeEnum[2] &&
                  checkInDate &&
                  checkOutDate && (
                    <div className="flex items-center justify-between border-y border-zinc-100 py-3">
                      <h3 className="font-rubik text-sm">No of Days</h3>
                      <h3 className="font-rubik text-sm">
                        {differenceInDays(
                          new Date(checkOutDate),
                          new Date(checkInDate),
                        )}{" "}
                        Days
                      </h3>
                    </div>
                  )}
                <div className="flex items-center justify-between border-b border-zinc-100 py-3">
                  <h3 className="font-rubik text-sm">Taxes & Service Fees</h3>
                  <h3 className="font-rubik text-sm">₹0</h3>
                </div>
                <div className="flex items-center justify-between py-3">
                  <h3 className="font-rubik font-semibold">
                    Total Amount to be paid
                  </h3>
                  <div>
                    {<h3 className="font-rubik font-semibold">₹{amount}</h3>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 z-0 h-72 w-full bg-orange-500"></div>
    </div>
  );
};

export default Page;
