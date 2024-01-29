"use client";

import { BookingProps, PropertyProps, Room } from "@/app/search/types";
import Wrapper from "@/components/wrapper";
import { ComplaintTypeEnum } from "@/lib/consts";
import {
  Input,
  Select,
  SelectItem,
  Selection,
  Textarea,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [booking, setBooking] = useState<BookingProps>();
  const [property, setProperty] = useState<PropertyProps>();
  const [room, setRoom] = useState<Room>();

  //inputs
  const [complaintType, setComplaintType] = useState<Selection>(new Set([]));
  const [complaint, setComplaint] = useState<string>("");

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

  if (loading)
    return (
      <Wrapper>
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-950" />
        </div>
      </Wrapper>
    );

  return (
    <Wrapper>
      <h1 className="font-rubik text-2xl font-medium text-black">Booking</h1>
      <div className="grid gap-5 rounded-xl bg-white p-5 sm:grid-cols-2 sm:gap-0">
        {property && (
          <div className="flex flex-col items-start justify-center gap-5 *:w-full sm:border-r-2 sm:border-dashed sm:p-5 sm:pl-0 sm:pt-0">
            <Image
              className="h-[240px] w-full rounded-xl"
              width={500}
              height={500}
              src={property?.images[0].url}
              alt={property.name}
            />
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
          </div>
        )}
        {booking && room && (
          <div className="flex flex-col items-start justify-start gap-5 pr-0 pt-0 *:w-full sm:p-5">
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
            <div className="flex flex-col items-start justify-start *:flex-1">
              <span className="font-rubik text-sm font-medium text-zinc-500">
                Room Details
              </span>
              <p className="font-rubik text-base font-medium text-black sm:text-xl">
                {room?.maxOccupancy % booking?.numberOfGuests} Bed
              </p>
            </div>

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
          radius="md"
          size="lg"
          //   variant="bordered"
          classNames={{
            trigger: "px-4 h-auto shadow-none border-1 py-3.5 rounded-xl",
            innerWrapper: "placeholder:text-zinc-500 text-zinc-500",
            value: "text-zinc-500",
            base: "font-rubik",
            label: "font-medium text-lg bottom-0",
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
          radius="md"
          size="lg"
          value={complaint}
          onValueChange={setComplaint}
          classNames={{
            input: "px-4 h-auto shadow-none border-1 py-3.5 rounded-xl",
            innerWrapper: "placeholder:text-zinc-500 text-zinc-500",
            base: "font-rubik",
            label: "font-medium text-lg bottom-0",
          }}
        />
      </div>
    </Wrapper>
  );
};

export default Page;
