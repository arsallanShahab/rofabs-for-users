"use client";

import { useGlobalContext } from "@/components/context-provider";
import { Tab, Tabs } from "@nextui-org/react";
import { BedDouble, Hotel, Loader2, User2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BookingProps, PropertyProps } from "../../search/types";

const Page = () => {
  const { user } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [myBookings, setMyBookings] = useState<
    { booking: BookingProps; property: PropertyProps }[]
  >([]);
  const [myUpcomingBookings, setMyUpcomingBookings] = useState<
    { booking: BookingProps; property: PropertyProps }[]
  >([]);
  const [myPastBookings, setMyPastBookings] = useState<
    { booking: BookingProps; property: PropertyProps }[]
  >([]);
  const [myCancelledBookings, setMyCancelledBookings] = useState<
    { booking: BookingProps; property: PropertyProps }[]
  >([]);

  useEffect(() => {
    const fetchMyBookings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/bookings/user/" + user?.uid);
        const data = (await response.json()) as {
          data: { booking: BookingProps; property: PropertyProps }[];
        };
        setMyBookings(data.data);

        const upcoming = data.data.filter(
          (booking) =>
            booking.booking.isCheckedIn === false &&
            booking.booking.isCheckedOut === false,
        );
        setMyUpcomingBookings(upcoming);

        const past = data.data.filter(
          (booking) => booking.booking.isCheckedOut === true,
        );
        setMyPastBookings(past);

        const cancelled = data.data.filter(
          (booking) => booking.booking.isCancelled === true,
        );
        setMyCancelledBookings(cancelled);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch my bookings");
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.uid) fetchMyBookings();
  }, [user]);

  return (
    <div className="min-h-screen bg-blue-50 p-5">
      <div className="mx-auto max-w-screen-xl sm:px-5">
        <div className="grid gap-5 rounded-2xl py-5">
          <h3 className="font-sora text-4xl font-bold">My Bookings</h3>
          <div className="rounded-3xl sm:p-2">
            <Tabs variant="underlined" classNames={{}}>
              <Tab key="all" title="All">
                {isLoading && (
                  <div className="flex items-center justify-start">
                    <Loader2 className="mr-2.5 h-6 w-6 animate-spin" />
                    <p className="text-lg font-bold text-black">Loading...</p>
                  </div>
                )}
                {!isLoading && myBookings.length === 0 && (
                  <div className="flex items-center justify-start">
                    <p className="text-lg font-bold text-black">No bookings</p>
                  </div>
                )}
                <h3 className="my-5 font-sora text-xl font-semibold">
                  Upcoming
                </h3>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {myUpcomingBookings.map((data) => {
                    return (
                      <Link
                        href={"/bookings/" + data.booking._id}
                        key={data.booking._id}
                        className="flex items-center justify-between gap-2.5 rounded-2xl bg-white p-3"
                      >
                        <div className="flex items-start justify-start gap-2.5">
                          <div className="rounded-2xl bg-orange-100 p-2">
                            <Hotel className="h-8 w-8 rounded-xl" />
                          </div>
                          <div className="flex flex-col items-start justify-center gap-1">
                            <p className="text-lg font-bold text-black">
                              {data.property.name}
                            </p>
                            <p className="max-w-sm text-sm text-gray-500">
                              {data.property.address}
                            </p>
                            <div className="flex gap-1.5">
                              {" "}
                              <p className="flex items-center justify-center rounded-lg bg-zinc-100 px-3 py-1.5 font-rubik text-xs font-medium text-black">
                                <User2 className="inline-block h-4 w-4" />{" "}
                                {data.booking.guestName}
                              </p>
                              <div className="flex items-center justify-center rounded-lg bg-zinc-100 px-3 py-1.5 font-rubik text-xs font-medium text-black">
                                <BedDouble className="inline-block h-4 w-4" />
                                {data.booking.roomType.toLowerCase() ===
                                "single"
                                  ? "Single Room"
                                  : data.booking.roomType.toLowerCase() ===
                                      "double"
                                    ? "Double Room"
                                    : data.booking.roomType.toLowerCase() ===
                                        "triple"
                                      ? "Triple Room"
                                      : "Dormitory"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <h3 className="my-5 font-sora text-xl font-semibold">All</h3>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {" "}
                  {myBookings.map((data) => {
                    return (
                      <Link
                        href={"/bookings/" + data.booking._id}
                        key={data.booking._id}
                        className="flex items-center justify-between gap-2.5 rounded-2xl bg-white p-3"
                      >
                        <div className="flex items-start justify-start gap-2.5">
                          <div className="rounded-2xl bg-orange-100 p-2">
                            <Hotel className="h-8 w-8 rounded-xl" />
                          </div>
                          <div className="flex flex-col items-start justify-center gap-1">
                            <p className="text-lg font-bold text-black">
                              {data.property.name}
                            </p>
                            <p className="max-w-sm text-sm text-gray-500">
                              {data.property.address}
                            </p>
                            <div className="flex gap-1.5">
                              {" "}
                              <p className="flex items-center justify-center rounded-lg bg-zinc-100 px-3 py-1.5 font-rubik text-xs font-medium text-black">
                                <User2 className="inline-block h-4 w-4" />{" "}
                                {data.booking.guestName}
                              </p>
                              <div className="flex items-center justify-center rounded-lg bg-zinc-100 px-3 py-1.5 font-rubik text-xs font-medium text-black">
                                <BedDouble className="inline-block h-4 w-4" />
                                {data.booking.roomType.toLowerCase() ===
                                "single"
                                  ? "Single Room"
                                  : data.booking.roomType.toLowerCase() ===
                                      "double"
                                    ? "Double Room"
                                    : data.booking.roomType.toLowerCase() ===
                                        "triple"
                                      ? "Triple Room"
                                      : "Dormitory"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </Tab>
              <Tab key="cancelled" title="Cancelled">
                {isLoading && (
                  <div className="flex items-center justify-start">
                    <Loader2 className="mr-2.5 h-6 w-6 animate-spin" />
                    <p className="text-lg font-bold text-black">Loading...</p>
                  </div>
                )}
                {!isLoading && myCancelledBookings.length === 0 && (
                  <div className="flex items-center justify-start">
                    <p className="text-lg font-bold text-black">
                      No cancelled bookings
                    </p>
                  </div>
                )}
                {myCancelledBookings.map((data) => {
                  return (
                    <Link
                      href={"/bookings/" + data.booking._id}
                      key={data.booking._id}
                      className="flex items-center justify-between gap-2.5 rounded-2xl bg-white p-3"
                    >
                      <div className="flex items-start justify-start gap-2.5">
                        <div className="rounded-2xl bg-orange-100 p-2">
                          <Hotel className="h-8 w-8 rounded-xl" />
                        </div>
                        <div className="flex flex-col items-start justify-center gap-1">
                          <p className="text-lg font-bold text-black">
                            {data.property.name}
                          </p>
                          <p className="max-w-sm text-sm text-gray-500">
                            {data.property.address}
                          </p>
                          <div className="flex gap-1.5">
                            {" "}
                            <p className="flex items-center justify-center rounded-lg bg-zinc-100 px-3 py-1.5 font-rubik text-xs font-medium text-black">
                              <User2 className="inline-block h-4 w-4" />{" "}
                              {data.booking.guestName}
                            </p>
                            <div className="flex items-center justify-center rounded-lg bg-zinc-100 px-3 py-1.5 font-rubik text-xs font-medium text-black">
                              <BedDouble className="inline-block h-4 w-4" />
                              {data.booking.roomType.toLowerCase() === "single"
                                ? "Single Room"
                                : data.booking.roomType.toLowerCase() ===
                                    "double"
                                  ? "Double Room"
                                  : data.booking.roomType.toLowerCase() ===
                                      "triple"
                                    ? "Triple Room"
                                    : "Dormitory"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </Tab>
              <Tab key="past" title="Completed">
                {isLoading && (
                  <div className="flex items-center justify-start">
                    <Loader2 className="mr-2.5 h-6 w-6 animate-spin" />
                    <p className="text-lg font-bold text-black">Loading...</p>
                  </div>
                )}
                {!isLoading && myPastBookings.length === 0 && (
                  <div className="flex items-center justify-start">
                    <p className="text-lg font-bold text-black">
                      No completed bookings
                    </p>
                  </div>
                )}
                {myPastBookings.map((data) => {
                  return (
                    <Link
                      href={"/bookings/" + data.booking._id}
                      key={data.booking._id}
                      className="flex items-center justify-between gap-2.5 rounded-2xl bg-white p-3"
                    >
                      <div className="flex items-start justify-start gap-2.5">
                        <div className="rounded-2xl bg-orange-100 p-2">
                          <Hotel className="h-8 w-8 rounded-xl" />
                        </div>
                        <div className="flex flex-col items-start justify-center gap-1">
                          <p className="text-lg font-bold text-black">
                            {data.property.name}
                          </p>
                          <p className="max-w-sm text-sm text-gray-500">
                            {data.property.address}
                          </p>
                          <div className="flex gap-1.5">
                            {" "}
                            <p className="flex items-center justify-center rounded-lg bg-zinc-100 px-3 py-1.5 font-rubik text-xs font-medium text-black">
                              <User2 className="inline-block h-4 w-4" />{" "}
                              {data.booking.guestName}
                            </p>
                            <div className="flex items-center justify-center rounded-lg bg-zinc-100 px-3 py-1.5 font-rubik text-xs font-medium text-black">
                              <BedDouble className="inline-block h-4 w-4" />
                              {data.booking.roomType.toLowerCase() === "single"
                                ? "Single Room"
                                : data.booking.roomType.toLowerCase() ===
                                    "double"
                                  ? "Double Room"
                                  : data.booking.roomType.toLowerCase() ===
                                      "triple"
                                    ? "Triple Room"
                                    : "Dormitory"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;