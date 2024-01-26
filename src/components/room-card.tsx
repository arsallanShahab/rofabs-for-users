import { Room } from "@/app/search/types";
import { PropertyTypeEnum } from "@/lib/consts";
import { cn } from "@/lib/utils";
import { AirVent, BedDouble, Home, User } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  roomType: string;
  roomCategory: string;
  data: Room[];
  totalGuests?: number;
};

const RoomCard: FC<Props> = ({ roomType, roomCategory, data, totalGuests }) => {
  const totalOccupancy = data[0].maxOccupancy * data.length;
  // const totalVacancy = data[0].maxOccupancy * data.length - data[0].bookedBeds;
  const totalVacancy = data.reduce((acc, room) => acc + room.vacancy, 0);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [propertyId, setPropertyId] = useState<string>();
  const [roomId, setRoomId] = useState<string>();
  const [numberOfGuests, setNumberOfGuests] = useState<number | string>(0);
  const [checkInDate, setCheckInDate] = useState<string>();
  const [checkOutDate, setCheckOutDate] = useState<string>();

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    if (params.has("property-id")) {
      setPropertyId(params.get("property-id")?.toString());
    }
    if (params.has("room-id")) {
      setRoomId(params.get("room-id")?.toString());
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
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleSelectRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    if (totalGuests === undefined) {
      toast("Please select number of guests.");
      return;
    }
    if (totalGuests > totalVacancy) {
      toast.error(
        "This room does not have enough vacancy for the selected number of guests.",
      );
      return;
    }
    if (
      data[0].propertyType === PropertyTypeEnum[0] &&
      (!numberOfGuests || numberOfGuests == "0")
    ) {
      toast.error("Please select number of guests.");
      return;
    }
    router.push("/bookings" + "?" + createQueryString("room-id", data[0]._id));
  };

  return (
    <div
      className={cn(
        "relative grid grid-cols-7 rounded-2xl border bg-white *:p-5 last:border-r-transparent",
        // totalVacancy === 0 && "cursor-not-allowed opacity-50",
      )}
    >
      {totalVacancy === 0 && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-2xl bg-red-100 bg-opacity-50">
          <h3 className="font-rubik text-xl font-semibold text-rose-600">
            No Vacancy Available
          </h3>
        </div>
      )}
      <div className="col-span-7 border-b sm:col-span-3 sm:border-b-0 sm:border-r">
        <p className="mb-2.5 font-rubik text-base font-medium text-black">
          {roomType} {roomCategory} Room X {data.length} Rooms
        </p>
        <Image
          src={data[0].images.roomImage[0].url}
          alt={data[0].roomNumber.toString()}
          width={500}
          height={500}
          className="h-60 w-full rounded-lg object-cover"
        />
        <div className="mt-2.5 grid grid-cols-2 gap-2.5 *:flex *:items-center *:justify-start *:gap-2 *:rounded-lg *:p-2.5 *:text-sm *:font-medium *:text-zinc-500">
          <div>
            <Home size={18} />
            {data[0].roomSize} sq.ft
          </div>
          <div>
            <BedDouble size={18} />
            {data[0].maxOccupancy} Bed
          </div>
          <div>
            <User size={18} />
            Max {data[0].maxOccupancy} guests
          </div>
          <div>
            <AirVent size={18} />
            {data[0].roomCategory} Room
          </div>
        </div>
      </div>
      <div className="col-span-7 flex flex-col items-start justify-between gap-1.5 border-b p-2.5 *:w-full sm:col-span-2 sm:border-b-0 sm:border-r">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Facilties</h3>
          <div className="flex flex-wrap items-start justify-start gap-2.5 sm:flex-col">
            {data[0].facilities.map((facility) => (
              <li
                key={facility}
                className="text-sm font-medium capitalize text-zinc-600"
              >
                {facility}
              </li>
            ))}
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5 *:mb-0">
          <h3 className="font-inter text-xs text-zinc-400">
            (1 Month Lock-In period.)
          </h3>
          <h3 className="font-inter text-xs text-zinc-400">
            (1 Month Notice Period.)
          </h3>
          <h3 className="font-inter text-xs text-zinc-400">
            (1 Month Deposit.)
          </h3>
        </div>
      </div>
      <div className="col-span-7 flex flex-col justify-between *:w-full sm:col-span-2">
        <div className="flex justify-between">
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-zinc-600">
              Total Rooms
            </span>
            <span className="text-lg font-semibold">
              {data.length} Rooms ({data[0].maxOccupancy * data.length} Beds)
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-zinc-600">
              Total Vacancy
            </span>
            <span className="text-lg font-semibold">{totalVacancy} Beds</span>
          </div>
        </div>
        <div>
          <p className="font-rubik text-3xl font-semibold">
            ₹{data[0].pricePerDay ? data[0].pricePerDay : data[0].pricePerMonth}
          </p>
          <span className="text-sm font-normal text-zinc-600">
            {data[0].pricePerDay ? " / Room / Day" : " / Bed / Month"}
          </span>
          <button
            onClick={handleSelectRoom}
            className=" mt-2 w-full rounded-lg bg-rose-500 py-4 font-bold text-white hover:bg-rose-600 active:scale-95 active:bg-rose-500"
          >
            SELECT ROOM
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
