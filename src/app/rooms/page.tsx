"use client";

import MapComponent from "@/components/map-component";
import RoomCard from "@/components/room-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PropertyTypeEnum } from "@/lib/consts";
import { groupByProp } from "@/lib/utils";
import { Input, ScrollShadow } from "@nextui-org/react";
import {
  BedDouble,
  ChevronsDown,
  Coffee,
  Map,
  Shield,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useRef, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Property, Room } from "../search/types";

type Props = {};

const Page: FC = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabBar = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [propertyId, setPropertyId] = useState<string>();
  const [roomId, setRoomId] = useState<string>();
  const [areaOrLandmark, setAreaOrLandmark] = useState<string>();
  const [numberOfGuests, setNumberOfGuests] = useState<number | string>(1);
  const [checkInDate, setCheckInDate] = useState<string>();
  const [checkOutDate, setCheckOutDate] = useState<string>();
  const [property, setProperty] = useState<Property>();
  const [room, setRoom] = useState<Room[]>();
  const [groupedRooms, setGroupedRooms] = useState<any | undefined>();

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

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    if (params.has("property-id")) {
      setPropertyId(params.get("property-id")?.toString());
    } else {
      router.push("/search");
    }
    if (params.has("check-in")) {
      setCheckInDate(params.get("check-in")?.toString());
    }
    if (params.has("check-out")) {
      setCheckOutDate(params.get("check-out")?.toString());
    }
    if (params.has("no-of-guests")) {
      setNumberOfGuests(Number(params.get("no-of-guests")?.toString()));
    } else {
      router.push(
        pathname +
          "?" +
          createQueryString({
            "no-of-guests": "1",
          }),
      );
      setNumberOfGuests(1);
    }
    if (params.has("area-or-landmark")) {
      setAreaOrLandmark(params.get("area-or-landmark")?.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/rooms?property-id=${propertyId}`);
        const data = await res.json();
        setProperty(data.property);
        const groupBy = groupByProp(data.rooms, ["roomType", "roomCategory"]);
        setGroupedRooms(groupBy);
        setRoom(data.rooms);
        router.push(
          pathname +
            "?" +
            createQueryString({
              "area-or-landmark": `${data.location.city}, ${data.location.region}, ${data.location.country_name}`,
            }),
        );
        // console.log(groupBy, "groupBy");
        // console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, propertyId]);

  useEffect(() => {
    if (tabBar.current) {
      document.documentElement.style.scrollPaddingTop = `${tabBar.current.offsetHeight + 79}px`;
    }
  }, [loading]);

  if (loading || !property || !room?.length) {
    return (
      <div className="mx-auto flex max-w-screen-xl flex-col items-start justify-start gap-5 *:w-full">
        <div className="grid w-full grid-cols-6 gap-5 bg-white p-5">
          {loading && (
            <div className="col-span-4 h-96 animate-pulse rounded-lg bg-blue-200"></div>
          )}
          {loading && (
            <div className="col-span-2 flex flex-col gap-2.5 *:w-full *:rounded-lg">
              <div className="flex-1 animate-pulse bg-amber-50 p-5"></div>
              <div className="flex-1 animate-pulse bg-blue-50 p-5"></div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="top-0 h-full min-h-screen">
      <div className="w-full bg-blue-500 text-white">
        <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-end gap-2.5 p-5">
          <Input
            label="Area or Landmark"
            placeholder="Area or Landmark"
            labelPlacement="outside"
            classNames={{
              inputWrapper: "rounded-md",
              base: "font-rubik w-full max-w-sm",
              input: "text-sm font-medium text-black",
              label: "text-[#fff_!important] font-medium text-sm",
            }}
            value={areaOrLandmark}
          />
          <Input
            type="date"
            label="Check In"
            placeholder="Check In"
            labelPlacement="outside"
            classNames={{
              inputWrapper: "rounded-md",
              base: "font-rubik text-sm w-full sm:max-w-[250px]",
              input: "font-medium text-black",
              label: "text-[#fff_!important] font-medium font-rubik text-sm",
            }}
            value={checkInDate}
            onChange={(e) => {
              router.push(
                pathname +
                  "?" +
                  createQueryString({
                    "check-in": e.target.value,
                  }),
              );
            }}
          />
          <Input
            type="date"
            label="Check Out"
            placeholder="Check Out"
            labelPlacement="outside"
            classNames={{
              inputWrapper: "rounded-md",
              base: "font-rubik text-sm w-full max-w-[250px]",
              input: "font-medium text-black",
              label: "text-[#fff_!important] font-medium font-rubik",
            }}
            value={checkOutDate}
            onChange={(e) => {
              router.push(
                pathname +
                  "?" +
                  createQueryString({
                    "check-out": e.target.value,
                  }),
              );
            }}
          />
          {property.type === PropertyTypeEnum[0] && (
            <Input
              type="number"
              label="No of Guests"
              placeholder="No of Guests"
              labelPlacement="outside"
              classNames={{
                inputWrapper: "rounded-md",
                base: "font-rubik text-sm w-full flex-1",
                input: "text-sm font-medium text-black",
                label: "text-[#fff_!important] font-medium text-sm",
              }}
              value={numberOfGuests.toString()}
              onChange={(e) => {
                router.push(
                  pathname +
                    "?" +
                    createQueryString({
                      "no-of-guests": e.target.value,
                    }),
                );
              }}
            />
          )}
          {/* <button className="flex flex-1 items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-blue-500">
            Search
          </button> */}
        </div>
      </div>
      <div className="relative mx-auto flex max-w-screen-xl flex-col items-start justify-start gap-5 bg-white *:w-full">
        <div className="grid w-full grid-cols-6 gap-5 bg-white p-5">
          <div className="col-span-6 flex flex-col items-start justify-center gap-2 *:w-full">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                );
              })}
            </div>
            <h3 className="font-inter text-2xl font-semibold">
              {property?.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1">
              <Map className="h-4 w-4 text-blue-400" />{" "}
              <span className="text-sm">{property?.address}</span>
            </div>
          </div>

          <div className="col-span-6 sm:col-span-4">
            <Swiper
              modules={[Pagination, Autoplay]}
              autoplay={{ delay: 2000, disableOnInteraction: true }}
              spaceBetween={50}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              // onSwiper={(swiper) => console.log(swiper)}
              // onSlideChange={() => console.log("slide change")}
            >
              {property &&
                property?.images.length > 0 &&
                property.images.map((image, k) => (
                  <SwiperSlide key={k + image.url}>
                    <Avatar className="h-60 w-full rounded-lg sm:h-96">
                      <AvatarImage
                        src={image.url}
                        alt={image.url}
                        className="h-full w-full object-cover"
                      />
                      <AvatarFallback className="flex h-full w-full items-center justify-center rounded-md bg-blue-100 text-blue-600">
                        <span className="font-rubik text-2xl font-medium">
                          loading...
                        </span>
                      </AvatarFallback>
                    </Avatar>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
          <div className="col-span-6 flex flex-col gap-2.5 *:w-full *:rounded-lg sm:col-span-2">
            <div className="flex-1 bg-amber-50 p-5">
              <div className="flex h-full flex-col justify-stretch gap-1 *:w-full">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col justify-start *:w-full">
                    <span className="font-rubik text-sm">price starts at</span>
                    <span className="font-sora text-2xl font-semibold">
                      ₹{" "}
                      {room?.length &&
                        (room[0]?.pricePerDay || room[0]?.pricePerMonth)}
                    </span>
                  </div>
                  <div className="flex flex-col justify-start gap-1.5 *:w-full">
                    <div className="flex items-center gap-1 font-rubik text-sm font-semibold">
                      <BedDouble className="mr-1 h-4 w-4" /> 1 X Room
                    </div>
                    <div className="flex items-center gap-1 font-rubik text-sm font-semibold">
                      <User className="mr-1 h-4 w-4" />{" "}
                      {room &&
                        (room[0].maxOccupancy > 1
                          ? `${room[0].maxOccupancy} Guests`
                          : `${room[0].maxOccupancy} Guest`)}
                    </div>
                  </div>
                </div>
                <span className="font-rubik text-sm font-semibold text-zinc-500">
                  1 pax per{" "}
                  {room?.length && (room[0]?.pricePerDay ? "night" : "month")}
                </span>
                <Link
                  href={"#room-options"}
                  className="mt-2.5 flex flex-1 items-center justify-center rounded-lg bg-amber-500 px-4 py-3 text-xl font-semibold text-white"
                >
                  view {room?.length} rooms <ChevronsDown className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 *:w-full *:flex-1">
              <div className="flex flex-col justify-center gap-1.5 rounded-xl border p-5">
                <div className="flex items-center justify-start gap-1.5 text-xs text-emerald-400">
                  <Shield className="h-4 w-4 fill-emerald-400 text-emerald-400" />{" "}
                  100% refundable on cancellation
                </div>
                <div className="flex items-center justify-start gap-1.5 text-xs text-emerald-400">
                  <Coffee className="h-4 w-4 fill-emerald-400 text-emerald-400" />{" "}
                  Free Breakfast Included in Price
                </div>
              </div>
              <div className="flex gap-2.5 rounded-xl *:flex *:flex-1 *:flex-col *:items-center *:justify-center *:rounded-lg *:border  *:p-3 *:text-left">
                <div className="text-xs font-semibold">
                  Check In{" "}
                  <span className="block text-sm font-semibold">10:00 AM</span>
                </div>
                <div className="text-xs font-semibold">
                  Check In{" "}
                  <span className="block text-sm font-semibold">12:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={tabBar}
        className="sticky left-0 top-[78px] z-[89] w-full overflow-x-auto border-y bg-white text-black shadow-lg"
      >
        <ScrollShadow orientation="horizontal" size={100}>
          <div className="mx-auto flex w-full max-w-screen-xl justify-start *:break-keep">
            <Link
              href={"#room-options"}
              className="whitespace-nowrap px-3 py-6 font-rubik text-xs font-medium sm:px-5 sm:text-base"
            >
              Room Options
            </Link>
            <Link
              href={"#amenities"}
              className="whitespace-nowrap px-3 py-6 font-rubik text-xs font-medium sm:px-5 sm:text-base"
            >
              Amenities
            </Link>
            <Link
              href={"#guest-reviews"}
              className="whitespace-nowrap px-3 py-6 font-rubik text-xs font-medium sm:px-5 sm:text-base"
            >
              Guest Reviews
            </Link>
            <Link
              href={"#property-policies"}
              className="whitespace-nowrap px-3 py-6 font-rubik text-xs font-medium sm:px-5 sm:text-base"
            >
              Property Policies
            </Link>
            <Link
              href={"#location"}
              className="whitespace-nowrap px-3 py-6 font-rubik text-xs font-medium sm:px-5 sm:text-base"
            >
              Location
            </Link>
          </div>
        </ScrollShadow>
      </div>
      <div className="w-full bg-blue-50 pt-5" id="room-options">
        <div className="mx-auto flex max-w-screen-xl flex-col items-start justify-start gap-5 pb-20 *:w-full">
          {groupedRooms &&
            groupedRooms.length > 0 &&
            groupedRooms.map(
              (
                room: {
                  roomType: string;
                  roomCategory: string;
                  data: Room[];
                },
                k: number,
              ) => {
                return (
                  <RoomCard
                    key={k}
                    roomType={room.roomType}
                    roomCategory={room.roomCategory}
                    data={room.data}
                    totalGuests={
                      numberOfGuests ? Number(numberOfGuests) : undefined
                    }
                  />
                );
              },
            )}
          <div
            id="amenities"
            className="flex flex-col gap-2.5 rounded-xl border  bg-white *:w-full"
          >
            <div className="border-b p-5">
              <h2 className="font-inter text-2xl font-semibold">
                Amenities at {property?.name}
              </h2>
            </div>
            <div className="border-b p-5">
              <h4 className="mb-5 font-inter text-sm font-semibold">
                Popular Amenities
              </h4>
              <div className="flex gap-2">
                {property.isCoupleFriendly ? (
                  <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2.5 font-rubik text-sm font-medium">
                    <Shield className="h-4 w-4 fill-emerald-400 text-emerald-400" />{" "}
                    Couple Friendly
                  </div>
                ) : null}
                {property.isParkingSpaceAvailable ? (
                  <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2.5 font-rubik text-sm font-medium">
                    <Shield className="h-4 w-4 fill-emerald-400 text-emerald-400" />{" "}
                    Parking Space Available
                  </div>
                ) : null}
                {property.isFeatured ? (
                  <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2.5 font-rubik text-sm font-medium">
                    <Shield className="h-4 w-4 fill-emerald-400 text-emerald-400" />{" "}
                    Featured Property
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col justify-start gap-1.5 p-5">
              {property.facilities.map((facility, k) => (
                <div key={k} className="text-md font-inter font-semibold">
                  {facility}
                </div>
              ))}
            </div>
          </div>
          <div
            id="property-policies"
            className="rounded-xl border bg-white *:w-full"
          >
            <div className="border-b p-5">
              <h2 className="font-inter text-2xl font-semibold">
                Property Policies
              </h2>
            </div>
            <div className="flex flex-col justify-start gap-1.5 p-5">
              {property.permissions &&
                property.permissions.map((policy, k) => (
                  <div key={k} className="text-md font-inter font-semibold">
                    {policy}
                  </div>
                ))}
              {property.permissions &&
                property.permissions.map((policy, k) => (
                  <div key={k} className="text-md font-inter font-semibold">
                    {policy}
                  </div>
                ))}
              {property.permissions &&
                property.permissions.map((policy, k) => (
                  <div key={k} className="text-md font-inter font-semibold">
                    {policy}
                  </div>
                ))}
            </div>
          </div>
          <div id="location" className="rounded-xl border bg-white *:w-full">
            <div className="border-b p-5">
              <h2 className="font-inter text-2xl font-semibold">
                {property.name} Location
              </h2>
            </div>
            <div className="grid grid-cols-7">
              <div className="col-span-7 border-r p-5 sm:col-span-5">
                <MapComponent
                  className="h-96 w-full rounded-lg border"
                  coordinate={{
                    lat: property.coOfLocation.coordinates[0],
                    lng: property.coOfLocation.coordinates[1],
                  }}
                />
              </div>
              <div className="col-span-7 flex flex-col items-start justify-start gap-2.5 p-5 sm:col-span-2">
                <span className="font-rubik font-medium text-black">
                  Nearby Places
                </span>
                {property.nearbyPlaces &&
                  property.nearbyPlaces.map((place, k) => (
                    <p
                      key={k}
                      className="break-words font-inter text-xs font-medium leading-normal"
                    >
                      • {place}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
