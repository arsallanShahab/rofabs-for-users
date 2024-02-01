"use client";

import {
  BookingProps,
  ComplaintProps,
  PropertyProps,
  ReviewProps,
  Room,
} from "@/app/search/types";
import { useGlobalContext } from "@/components/context-provider";
import Wrapper from "@/components/wrapper";
import { ComplaintTypeEnum } from "@/lib/consts";
import { cn } from "@/lib/utils";
import {
  Input,
  Select,
  SelectItem,
  Selection,
  Textarea,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { Loader2, Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { id } = useParams();
  const { user } = useGlobalContext();

  const [loading, setLoading] = useState<boolean>(true);
  const [booking, setBooking] = useState<BookingProps>();
  const [property, setProperty] = useState<PropertyProps>();
  const [room, setRoom] = useState<Room>();

  //inputs
  const [complaintType, setComplaintType] = useState<Selection>(new Set([]));
  const [complaint, setComplaint] = useState<string>("");
  const [addingComplaint, setAddingComplaint] = useState<boolean>(false);

  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [addingReview, setAddingReview] = useState<boolean>(false);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/bookings/${id}`);
        const { data, success } = await res.json();
        setBooking(data.booking);
        setProperty(data.property);
        setRoom(data.room);
      } catch (error) {
        const err = error as Error & { message?: string };
        console.log(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleAddComplaint = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (Array.from(complaintType)?.length === 0) {
      toast.error("Please Select Complaint Type");
      return;
    }
    if (complaint === "") {
      toast.error("Please Enter Complaint");
      return;
    }
    if (!property?.owner_user_id)
      return toast.error("Property Owner Not Found");
    if (!booking?._id) return toast.error("Booking Not Found");
    if (!booking?.user) return toast.error("User Not Found");
    if (property?._id === undefined) return toast.error("Property Not Found");
    setAddingComplaint(true);
    try {
      console.log(property?.owner_user_id);
      const body: ComplaintProps = {
        owner_user_id: property?.owner_user_id,
        propertyId: property?._id,
        propertyName: property?.name as string,
        bookingId: booking?._id,
        userId: booking?.user as string,
        userName: booking?.guestName as string,
        userPhoneNumber: booking?.guestPhoneNumber as number,
        userEmailAddress: booking?.guestEmail as string,
        complaintType: Array.from(complaintType)[0] as string,
        complaintDetails: complaint as string,
        complaintStatus: "pending",
      };
      console.log(body);
      const res = await fetch(`/api/complaints/add`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { success } = await res.json();
      if (success) {
        toast.success("Complaint Added Successfully");
        setComplaint("");
        setComplaintType(new Set([]));
      }
    } catch (error) {
      const err = error as Error & { message?: string };
      console.log(err.message);
      toast.error(err.message);
    } finally {
      setAddingComplaint(false);
    }
  };

  const handleAddReview = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) return toast.error("Please Login to Add Review");
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please Rate Your Experience");
      return;
    }
    if (review === "") {
      toast.error("Please Enter Review");
      return;
    }
    if (!property?._id) return toast.error("Property Not Found");
    if (!property?.owner_user_id)
      return toast.error("Property Owner Not Found");
    if (!booking?._id) return toast.error("Booking Not Found");
    setAddingReview(true);
    try {
      const body: ReviewProps = {
        owner_user_id: property?.owner_user_id,
        propertyId: property?._id,
        propertyName: property?.name as string,
        bookingId: booking?._id,
        userId: booking?.user as string,
        userName: booking?.guestName as string,
        userPhoneNumber: booking?.guestPhoneNumber as number,
        userEmailAddress: booking?.guestEmail as string,
        rating: rating as number,
        review: review as string,
        avatar: user?.photoUrl as string,
      };
      console.log(body);
      const res = await fetch(`/api/reviews/add`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { success } = await res.json();
      if (success) {
        toast.success("Review Added Successfully");
        setReview("");
        setRating(0);
      }
    } catch (error) {
      const err = error as Error & { message?: string };
      console.log(err.message);
      toast.error(err.message);
    } finally {
      setAddingReview(false);
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-950" />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h1 className="font-sora text-4xl font-bold">Booking</h1>
      <div className="grid gap-5 rounded-2xl border bg-white shadow-sm sm:grid-cols-2 sm:gap-0">
        {property && (
          <div className="flex flex-col items-start justify-center gap-5 p-3 *:w-full sm:border-r-2 sm:border-dashed">
            <Image
              className="h-full w-full rounded-xl"
              width={500}
              height={500}
              src={property?.images[0].url}
              alt={property.name}
            />
          </div>
        )}
        {booking && room && (
          <div className="flex flex-col items-start justify-start gap-5 p-3 *:w-full sm:p-5">
            <div className="flex flex-col items-start justify-center gap-1.5">
              <p className="font-rubik text-xs font-medium text-zinc-500">
                {property?.type}
              </p>
              <h2 className="font-rubik text-4xl font-medium text-black">
                {property?.name}
              </h2>
              <p className="max-w-sm text-sm text-zinc-600">
                {property?.address}
              </p>
            </div>
            <div className="relative flex justify-between gap-2.5 *:flex-1">
              <div className="border-r-2 border-dashed pt-2">
                <span className="font-rubik text-sm font-medium text-zinc-500">
                  Check In
                </span>
                <p className="font-rubik text-xl font-medium text-black">
                  {dayjs(booking?.from).format("DD MMM YYYY")}
                </p>
              </div>
              <div className="absolute left-1/2 top-1/2 -ml-1 -translate-x-1/2 -translate-y-1/2 transform bg-white p-1 text-center">
                <p className="font-rubik text-sm font-medium text-black sm:text-xl">
                  {dayjs(booking?.to).diff(dayjs(booking?.from), "day")} DAYS
                </p>
              </div>
              <div className="pt-2 text-right">
                <span className="font-rubik text-sm font-medium text-zinc-500">
                  Check Out
                </span>
                <p className="font-rubik text-xl font-medium text-black">
                  {dayjs(booking?.to).format("DD MMM YYYY")}
                </p>
              </div>
            </div>
            <div className="flex justify-between gap-2.5 *:flex-1">
              <div className="flex flex-col items-start justify-start">
                <span className="font-rubik text-sm font-medium text-zinc-500">
                  Room Type
                </span>
                <p className="font-rubik text-base font-medium text-black sm:text-xl">
                  {booking?.roomType} {booking?.roomCategory} Room
                </p>
              </div>
              <div className="flex flex-col items-end justify-start text-right">
                <span className="font-rubik text-sm font-medium text-zinc-500">
                  Room Category
                </span>
                <p className="font-rubik text-base font-medium text-black sm:text-xl">
                  {room?.roomCategory} Room
                </p>
              </div>
            </div>
            {/* <div className="flex flex-col items-start justify-start *:flex-1">
              <span className="font-rubik text-sm font-medium text-zinc-500">
                Room Details
              </span>
              <p className="font-rubik text-base font-medium text-black sm:text-xl">
                {room?.maxOccupancy % booking?.numberOfGuests || "1"} Bed
              </p>
            </div> */}

            <div className="flex flex-col items-start justify-start *:flex-1">
              <span className="font-rubik text-sm font-medium text-zinc-500">
                Room Size
              </span>
              <p className="font-rubik text-base font-medium text-black sm:text-xl">
                {room?.roomSize} sq.ft
              </p>
            </div>

            <div className="flex flex-col items-start justify-start *:flex-1">
              <span className="font-rubik text-sm font-medium text-zinc-500">
                Total Guests
              </span>
              <p className="font-rubik text-base font-medium text-black sm:text-xl">
                {booking?.numberOfGuests}
              </p>
            </div>
          </div>
        )}
      </div>
      {booking?.isCheckedIn && !booking.isCheckedOut && (
        <>
          {" "}
          <h1 className="mt-5 font-rubik text-2xl font-medium text-black">
            Complaints
          </h1>
          <div className="grid gap-2.5 rounded-xl bg-white p-5">
            <Select
              name="complaintType"
              color="default"
              label="Complaint Type"
              labelPlacement="outside"
              placeholder="Select Complaint Type"
              selectedKeys={complaintType}
              onSelectionChange={setComplaintType}
              variant="bordered"
              classNames={{
                trigger: "px-4 h-auto shadow-none border-1 py-3.5 rounded-lg",
                // innerWrapper: "placeholder:text-zinc-500 text-zinc-500",
                value: "text-zinc-500",
                base: "font-rubik",
                label: "-bottom-0.5",
              }}
            >
              {ComplaintTypeEnum.map((complaintType) => (
                <SelectItem key={complaintType} value={complaintType}>
                  {complaintType}
                </SelectItem>
              ))}
            </Select>
            <Textarea
              name="complaint"
              color="default"
              label="Complaint"
              labelPlacement="outside"
              placeholder="Enter Complaint"
              value={complaint}
              onValueChange={setComplaint}
              variant="bordered"
              classNames={{
                inputWrapper:
                  "px-4 h-auto shadow-none border-1 py-3.5 rounded-lg",
                // innerWrapper:
                //   "placeholder:text-zinc-500 text-zinc-500 px-4 py-3.5",
                base: "font-rubik",
                // label: "font-medium text-lg bottom-0",
              }}
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddComplaint}
                className="flex items-center justify-center gap-2.5 rounded-lg bg-indigo-950 px-6 py-3 font-rubik text-sm text-white duration-100 hover:bg-indigo-900 active:scale-95"
              >
                {addingComplaint && (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                )}
                add complaint
              </button>
            </div>
          </div>
        </>
      )}

      {booking?.isCheckedOut && (
        <>
          <h1 className="mt-5 font-rubik text-2xl font-medium text-black">
            Reviews
          </h1>
          <div className="grid gap-2.5 rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="font-rubik text-sm font-medium text-black">
              Rate Your Experience
            </h3>
            <div className="flex gap-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  onClick={() => setRating(i + 1)}
                  key={i}
                  size={24}
                  className={cn(
                    "h-8 w-8 text-indigo-950",
                    i < rating && "fill-yellow-400 text-yellow-400",
                  )}
                  strokeWidth={2}
                />
              ))}
            </div>
            <h3 className="font-rubik text-sm font-medium text-black">
              Write Your Review
            </h3>
            <Input
              // name="review"
              color="default"
              // label="Review"
              labelPlacement="outside"
              placeholder="Enter Review"
              variant="bordered"
              value={review}
              onValueChange={setReview}
              classNames={{
                inputWrapper:
                  "px-4 h-auto shadow-none border-1 py-3.5 rounded-lg",
                base: "font-rubik",
              }}
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddReview}
                className="flex items-center justify-center gap-2.5 rounded-lg bg-indigo-950 px-6 py-3 font-rubik text-sm text-white duration-100 hover:bg-indigo-900 active:scale-95"
              >
                {addingReview && (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                )}
                add review
              </button>
            </div>
          </div>
        </>
      )}
    </Wrapper>
  );
};

export default Page;
