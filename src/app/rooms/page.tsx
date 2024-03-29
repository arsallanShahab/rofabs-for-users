"use client";

import MapComponent from "@/components/map-component";
import RoomCard from "@/components/room-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Wrapper from "@/components/wrapper";
import { DaysEnum, MealNameEnum, PropertyTypeEnum } from "@/lib/consts";
import { cn, groupByProp } from "@/lib/utils";
import { Input, Progress, ScrollShadow } from "@nextui-org/react";
import dayjs from "dayjs";
import {
  BedDouble,
  ChevronsDown,
  Coffee,
  Map,
  Shield,
  Star,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FoodMenuProps, Property, ReviewProps, Room } from "../search/types";

import realtiveTime from "dayjs/plugin/relativeTime";

dayjs.extend(realtiveTime);

type Props = {};

const Page: FC = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabBar = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [propertyId, setPropertyId] = useState<string>();
  const [roomId, setRoomId] = useState<string>();
  const [areaOrLandmark, setAreaOrLandmark] = useState<string>();
  const [numberOfGuests, setNumberOfGuests] = useState<number | string>(1);
  const [checkInDate, setCheckInDate] = useState<string>();
  const [checkOutDate, setCheckOutDate] = useState<string>();
  const [property, setProperty] = useState<Property>();
  const [reviews, setReviews] = useState<{
    total: number;
    avgRating: number;
    maxRating: { rating: string; count: number };
    ratings: Record<string, number>;
    data: ReviewProps[];
  }>();
  // const [room, setRoom] = useState<Room[]>();
  const [groupedRooms, setGroupedRooms] = useState<any | undefined>();

  const [foodMenu, setFoodMenu] = useState<FoodMenuProps[]>(
    DaysEnum.map((day: string) => {
      return {
        day: day,
        meals: [
          {
            name: MealNameEnum[0],
            hasMealItems: false,
            vegMealItems: [],
            nonVegMealItems: [],
          },
          {
            name: MealNameEnum[1],
            hasMealItems: false,
            vegMealItems: [],
            nonVegMealItems: [],
          },
          {
            name: MealNameEnum[2],
            hasMealItems: false,
            vegMealItems: [],
            nonVegMealItems: [],
          },
          {
            name: MealNameEnum[3],
            hasMealItems: false,
            vegMealItems: [],
            nonVegMealItems: [],
          },
        ],
      };
    }),
  );

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
        const res = await fetch(
          `/api/rooms?property-id=${propertyId}&from=${checkInDate}&to=${checkOutDate}&no-of-guests=${numberOfGuests}`,
        );
        const data = await res.json();
        setProperty(data.property);
        setReviews(data.reviews);
        setFoodMenu(data.property.foodMenu);
        // const groupBy = groupByProp(data.rooms, ["roomType", "roomCategory"]);
        setGroupedRooms(data.rooms);
        // setRoom(data.rooms);
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
  }, [roomId, propertyId, checkInDate, checkOutDate, numberOfGuests]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--scroll-padding-top",
      175 + "px",
    );
  }, []);

  if (loading || !property) {
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
              if (checkOutDate) {
                if (new Date(e.target.value) > new Date(checkOutDate)) {
                  toast.error("Check-in date cannot be after check-out date.");
                  return;
                }
                router.push(
                  pathname +
                    "?" +
                    createQueryString({
                      "check-in": e.target.value,
                    }),
                );
              } else {
                router.push(
                  pathname +
                    "?" +
                    createQueryString({
                      "check-in": e.target.value,
                    }),
                );
              }
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
              e.preventDefault();
              if (checkInDate) {
                if (new Date(checkInDate) > new Date(e.target.value)) {
                  toast.error("Check-out date cannot be before check-in date.");
                  return;
                }
                router.push(
                  pathname +
                    "?" +
                    createQueryString({
                      "check-out": e.target.value,
                    }),
                );
              } else {
                toast.error("Please select check-in date first.");
                e.preventDefault();
                return;
              }
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
            {/* {groupedRooms && groupedRooms[0]?.data?.length === 0 && (
              <div className="flex-1 bg-rose-500 p-5 font-medium text-white">
                This property is not available for the selected dates.
              </div>
            )} */}
            {groupedRooms && (
              <div className="flex-1 bg-amber-50 p-5">
                <div className="flex h-full flex-col justify-stretch gap-1 *:w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col justify-start *:w-full">
                      <span className="font-rubik text-sm">
                        price starts at
                      </span>
                      <span className="font-sora text-2xl font-semibold">
                        ₹{" "}
                        {groupedRooms[0]?.data[0]?.pricePerDay ||
                          groupedRooms[0]?.data[0]?.pricePerMonth}
                      </span>
                    </div>
                    <div className="flex flex-col justify-start gap-1.5 *:w-full">
                      <div className="flex items-center gap-1 font-rubik text-sm font-semibold">
                        <BedDouble className="mr-1 h-4 w-4" /> 1 X Room
                      </div>
                      <div className="flex items-center gap-1 font-rubik text-sm font-semibold">
                        <User className="mr-1 h-4 w-4" />{" "}
                        {groupedRooms[0]?.data[0].maxOccupancy > 1
                          ? `${groupedRooms[0]?.data[0].maxOccupancy} Guests`
                          : `${groupedRooms[0]?.data[0].maxOccupancy} Guest`}
                      </div>
                    </div>
                  </div>
                  <span className="font-rubik text-sm font-semibold text-zinc-500">
                    1 pax per{" "}
                    {groupedRooms[0]?.data?.length &&
                      (groupedRooms[0]?.data[0]?.pricePerDay
                        ? "night"
                        : "month")}
                  </span>
                  <Link
                    href={"#room-options"}
                    className="mt-2.5 flex flex-1 items-center justify-center rounded-lg bg-amber-500 px-4 py-3 text-xl font-semibold text-white duration-100 hover:bg-orange-500 active:scale-95"
                  >
                    view{" "}
                    {groupedRooms.reduce(
                      (acc: number, room: any) => acc + room.data.length,
                      0,
                    )}{" "}
                    rooms <ChevronsDown className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
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
        className="sticky left-0 top-[0px] z-[89] w-full overflow-x-auto border-y bg-white text-black shadow-lg"
      >
        <ScrollShadow orientation="horizontal" size={100}>
          <div className="mx-auto flex w-full max-w-screen-xl justify-start py-3.5 *:break-keep">
            <Link
              href={"#room-options"}
              className="whitespace-nowrap rounded-lg px-3 py-2.5 font-rubik text-xs font-medium duration-100 hover:bg-zinc-100 sm:px-5 sm:text-base"
            >
              Room Options
            </Link>
            <Link
              href={"#amenities"}
              className="whitespace-nowrap rounded-lg px-3 py-2.5 font-rubik text-xs font-medium duration-100 hover:bg-zinc-100 sm:px-5 sm:text-base"
            >
              Amenities
            </Link>
            <Link
              href={"#food-menu"}
              className="whitespace-nowrap rounded-lg px-3 py-2.5 font-rubik text-xs font-medium duration-100 hover:bg-zinc-100 sm:px-5 sm:text-base"
            >
              Food Menu
            </Link>
            <Link
              href={"#guest-reviews"}
              className="whitespace-nowrap rounded-lg px-3 py-2.5 font-rubik text-xs font-medium duration-100 hover:bg-zinc-100 sm:px-5 sm:text-base"
            >
              Guest Reviews
            </Link>
            <Link
              href={"#property-policies"}
              className="whitespace-nowrap rounded-lg px-3 py-2.5 font-rubik text-xs font-medium duration-100 hover:bg-zinc-100 sm:px-5 sm:text-base"
            >
              Property Policies
            </Link>
            <Link
              href={"#location"}
              className="whitespace-nowrap rounded-lg px-3 py-2.5 font-rubik text-xs font-medium duration-100 hover:bg-zinc-100 sm:px-5 sm:text-base"
            >
              Location
            </Link>
          </div>
        </ScrollShadow>
      </div>
      <Wrapper ref={wrapperRef}>
        <div
          id="room-options"
          className="flex flex-col items-start justify-start gap-5 *:w-full"
        >
          {" "}
          {groupedRooms &&
            groupedRooms.length > 0 &&
            groupedRooms.map(
              (
                room: {
                  roomType: string;
                  roomCategory: string;
                  isAvailable: boolean;
                  data: Room[];
                },
                k: number,
              ) => {
                return (
                  <RoomCard
                    key={k}
                    roomType={room.roomType}
                    roomCategory={room.roomCategory}
                    isAvailable={room.isAvailable}
                    data={room.data}
                    numberOfGuests={
                      numberOfGuests ? Number(numberOfGuests) : undefined
                    }
                  />
                );
              },
            )}
        </div>
        <div
          id="amenities"
          className="flex flex-col gap-2.5 rounded-xl border bg-white shadow-sm *:w-full"
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
          id="food-menu"
          className="rounded-xl border bg-white font-rubik shadow-sm *:w-full"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>
                  Breakfast
                  <span className="block text-xs">
                    Timing: 7:00 AM - 10:00 AM
                  </span>
                </TableHead>
                <TableHead>
                  Lunch
                  <span className="block text-xs">
                    Timing: 12:00 PM - 3:00 PM
                  </span>
                </TableHead>
                <TableHead>
                  Snack
                  <span className="block text-xs">
                    Timing: 4:00 PM - 6:00 PM
                  </span>
                </TableHead>
                <TableHead>
                  Dinner
                  <span className="block text-xs">
                    Timing: 8:00 PM - 10:00 PM
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foodMenu &&
                foodMenu.length > 0 &&
                foodMenu.map((day: FoodMenuProps, dayIndex) => {
                  return (
                    <TableRow key={dayIndex}>
                      <TableCell className="border-r">{day?.day}</TableCell>
                      <TableCell className="border-r p-0">
                        <div className=" flex w-full flex-col *:flex-1 *:p-4">
                          <div className="border-b">
                            <span className="block">
                              {day.meals.map(
                                (meal, mealIndex) =>
                                  meal["name"] === MealNameEnum[0] &&
                                  meal.vegMealItems.length > 0 && (
                                    <span
                                      className="font-semibold"
                                      key={mealIndex}
                                    >
                                      Veg
                                    </span>
                                  ),
                              )}
                            </span>
                            <span className="mt-2 flex gap-1">
                              {day?.meals.map((meal) => {
                                if (
                                  meal["name"] === MealNameEnum[0] &&
                                  meal.vegMealItems.length > 0
                                ) {
                                  return meal?.vegMealItems?.map((item, _) => (
                                    <Badge key={_}>{item}</Badge>
                                  ));
                                }
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="block">
                              {day.meals.map(
                                (meal, mealIndex) =>
                                  meal["name"] === MealNameEnum[0] &&
                                  meal.nonVegMealItems.length > 0 && (
                                    <span
                                      className="font-semibold"
                                      key={mealIndex}
                                    >
                                      Non-Veg
                                    </span>
                                  ),
                              )}
                            </span>
                            <span className="mt-2 flex gap-1">
                              {day?.meals.map((meal) => {
                                if (
                                  meal["name"] === MealNameEnum[0] &&
                                  meal.nonVegMealItems.length > 0
                                ) {
                                  return meal?.nonVegMealItems?.map(
                                    (item, _) => <Badge key={_}>{item}</Badge>,
                                  );
                                }
                              })}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="border-r p-0">
                        <div className=" flex w-full flex-col *:flex-1 *:p-4">
                          <div className="border-b">
                            <span className="block">
                              {day.meals.map(
                                (meal, mealIndex) =>
                                  meal["name"] === MealNameEnum[1] &&
                                  meal.vegMealItems.length > 0 && (
                                    <span
                                      className="font-semibold"
                                      key={mealIndex}
                                    >
                                      Veg
                                    </span>
                                  ),
                              )}
                            </span>
                            <span className="mt-2 flex gap-1">
                              {day?.meals.map((meal) => {
                                if (
                                  meal["name"] === MealNameEnum[1] &&
                                  meal.vegMealItems.length > 0
                                ) {
                                  return meal?.vegMealItems?.map((item, _) => (
                                    <Badge key={_}>{item}</Badge>
                                  ));
                                }
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="block">
                              {day.meals.map(
                                (meal, mealIndex) =>
                                  meal["name"] === MealNameEnum[1] &&
                                  meal.nonVegMealItems.length > 0 && (
                                    <span
                                      className="font-semibold"
                                      key={mealIndex}
                                    >
                                      Non-Veg
                                    </span>
                                  ),
                              )}
                            </span>
                            <span className="mt-2 flex gap-1">
                              {day?.meals.map((meal) => {
                                if (
                                  meal["name"] === MealNameEnum[1] &&
                                  meal.nonVegMealItems.length > 0
                                ) {
                                  return meal?.nonVegMealItems?.map(
                                    (item, _) => <Badge key={_}>{item}</Badge>,
                                  );
                                }
                              })}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="border-r">
                        <div className="flex w-full flex-col *:flex-1">
                          <span className="block">
                            {day.meals.map((meal, mealIndex) => {
                              //check if there is a meal name snack
                              //and if there are any meal items
                              //if there are no meal items, then show N/P
                              if (
                                meal["name"] === MealNameEnum[2] &&
                                meal.hasMealItems == false
                              ) {
                                return "N/P";
                              }
                              if (
                                meal["name"] === MealNameEnum[2] &&
                                (meal.vegMealItems.length > 0 ||
                                  meal.nonVegMealItems.length > 0)
                              ) {
                                return (
                                  <span
                                    className="font-semibold"
                                    key={mealIndex}
                                  >
                                    snack items
                                  </span>
                                );
                              }
                            })}
                            {day.meals.length < 2 && "N/P"}
                          </span>
                          <span className="mt-2 flex gap-1">
                            {day?.meals.map((meal) => {
                              if (
                                meal["name"] === MealNameEnum[2] &&
                                meal.vegMealItems.length > 0
                              ) {
                                return meal?.vegMealItems?.map((item, _) => (
                                  <Badge key={_}>{item}</Badge>
                                ));
                              }
                            })}
                          </span>
                          <span className="mt-2 flex gap-1">
                            {day?.meals.map((meal) => {
                              if (
                                meal["name"] === MealNameEnum[2] &&
                                meal.nonVegMealItems.length > 0
                              ) {
                                return meal?.nonVegMealItems?.map((item, _) => (
                                  <Badge key={_}>{item}</Badge>
                                ));
                              }
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-0">
                        <div className=" flex w-full flex-col *:flex-1 *:p-4">
                          <div className="border-b">
                            <span className="block">
                              {day.meals.map(
                                (meal, mealIndex) =>
                                  meal["name"] === MealNameEnum[3] &&
                                  meal.vegMealItems.length > 0 && (
                                    <span
                                      className="font-semibold"
                                      key={mealIndex}
                                    >
                                      Veg
                                    </span>
                                  ),
                              )}
                            </span>
                            <span className="mt-2 flex gap-1">
                              {day?.meals.map((meal) => {
                                if (
                                  meal["name"] === MealNameEnum[3] &&
                                  meal.vegMealItems.length > 0
                                ) {
                                  return meal?.vegMealItems?.map((item, _) => (
                                    <Badge key={_}>{item}</Badge>
                                  ));
                                }
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="block">
                              {day.meals.map(
                                (meal, mealIndex) =>
                                  meal["name"] === MealNameEnum[3] &&
                                  meal.nonVegMealItems.length > 0 && (
                                    <span
                                      className="font-semibold"
                                      key={mealIndex}
                                    >
                                      Non-Veg
                                    </span>
                                  ),
                              )}
                            </span>
                            <span className="mt-2 flex gap-1">
                              {day?.meals.map((meal) => {
                                if (
                                  meal["name"] === MealNameEnum[3] &&
                                  meal.nonVegMealItems.length > 0
                                ) {
                                  return meal?.nonVegMealItems?.map(
                                    (item, _) => <Badge key={_}>{item}</Badge>,
                                  );
                                }
                              })}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <div
          id="guest-reviews"
          className="rounded-xl border bg-white shadow-sm *:w-full"
        >
          <div className="border-b p-5">
            <h2 className="font-inter text-2xl font-semibold">
              Guest Reviews & Ratings
            </h2>
          </div>
          <div className="flex flex-row gap-2.5 border-b p-5">
            {reviews?.avgRating && (
              <>
                <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg bg-green-500 p-5 *:w-full">
                  <span className="flex items-end gap-1.5 font-sora text-6xl font-semibold text-white">
                    {reviews.avgRating}
                    <span className="text-2xl font-medium">/5</span>
                  </span>

                  <span className="text-sm font-medium text-white/80">
                    {reviews.total} Reviews
                  </span>
                </div>
                <div className="flex w-full flex-col items-start justify-center gap-1.5">
                  {Object.entries(reviews.ratings)
                    .reverse()
                    .map(([rating, count], k) => {
                      return (
                        <div
                          key={k}
                          className="flex w-full max-w-sm items-center justify-start gap-2.5"
                        >
                          <div className="flex items-center">
                            {" "}
                            <span className="font-sora font-medium">
                              {parseInt(rating) + 1}
                            </span>
                            <Star className="ml-1 h-4 w-4 fill-black text-black" />{" "}
                          </div>
                          <Progress
                            className="h-2"
                            value={count}
                            maxValue={reviews.total}
                            color={
                              rating === "0"
                                ? "danger"
                                : rating === "1"
                                  ? "danger"
                                  : rating === "2"
                                    ? "warning"
                                    : rating === "3"
                                      ? "warning"
                                      : rating === "4"
                                        ? "success"
                                        : "default"
                            }
                          />
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2.5 p-5">
            {reviews?.data && reviews.data.length > 0 ? (
              reviews.data.map((review, k) => (
                <div key={k} className="flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={review.profilePicture as string}
                        alt={review.userName}
                        width={40}
                        height={40}
                      />
                      <div className="flex flex-col items-start justify-center">
                        <span className="text-md font-sora font-semibold">
                          {review.userName}{" "}
                          {review.createdAt && (
                            <span className="font-inter text-xs font-normal">
                              ({dayjs().to(dayjs(review.createdAt))})
                            </span>
                          )}
                        </span>
                        <span className="font-rubik text-sm">
                          {review.userEmailAddress}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "flex items-center rounded-md bg-green-500 p-2 font-inter text-sm font-semibold text-white",
                          review.rating === 1
                            ? "bg-red-500"
                            : review.rating === 2
                              ? "bg-red-500"
                              : review.rating === 3
                                ? "bg-yellow-500"
                                : review.rating === 4
                                  ? "bg-yellow-500"
                                  : review.rating === 5
                                    ? "bg-green-500"
                                    : "bg-green-500",
                        )}
                      >
                        {review.rating}{" "}
                        <Star className="h-4 w-4 fill-white text-white" />
                      </span>
                    </div>
                  </div>
                  <p className="text-md ml-12 rounded-lg bg-zinc-50 p-2 font-rubik">
                    {review.review}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-5 font-inter text-sm font-semibold">
                No reviews yet.
              </div>
            )}
          </div>
        </div>
        <div
          id="property-policies"
          className="rounded-xl border bg-white shadow-sm *:w-full"
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
        <div
          id="location"
          className="rounded-xl border bg-white shadow-sm *:w-full"
        >
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
      </Wrapper>
    </div>
  );
};

export default Page;
