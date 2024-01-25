"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PropertyTypeEnum, RoomCategoryEnum, RoomTypeEnum } from "@/lib/consts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, SwiperSlideProps } from "swiper/react";
import { SearchResponse } from "./types";
// Import Swiper styles
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Play, Star } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const Search: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [activeStates, setActiveStates] = useState({
    propertyType: true,
    roomType: true,
    roomCategory: true,
  });

  const [propertyType, setPropertyType] = useState<string>();
  const [roomType, setRoomType] = useState<string>();
  const [roomCategory, setRoomCategory] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [searchRooms, setSearchRooms] = useState<SearchResponse>();

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
    if (params.has("property-type")) {
      setPropertyType(
        params.get("property-type")?.replace("-", "/").replace("+", " "),
      );
    }
    if (params.has("room-type")) {
      setRoomType(params.get("room-type")?.replace("-", "/").replace("+", " "));
    }
    if (params.has("room-category")) {
      setRoomCategory(
        params.get("room-category")?.replace("-", "/").replace("+", " "),
      );
    }
    if (params.has("location")) {
      setLocation(params.get("location")?.replace("+", " "));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setSearchRooms({ data: [] });
        const params = new URLSearchParams(searchParams?.toString());
        console.log(params.toString());
        const res = await fetch("/api/search/rooms?" + params.toString(), {
          method: "GET",
        });
        const data = await res.json();
        setSearchRooms(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [searchParams]);

  return (
    <div className="bg-blue-50">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col items-start justify-start px-2.5 md:flex-row md:gap-5 lg:px-0">
        <div className="my-5 flex h-full w-full flex-row items-start justify-start rounded-xl bg-white *:border-b *:border-indigo-50 *:p-5 md:w-[275px] md:flex-col md:*:w-full">
          <div className="flex flex-col gap-2.5">
            <div
              onClick={() =>
                setActiveStates((prev) => ({
                  ...prev,
                  propertyType: !prev.propertyType,
                }))
              }
              className="cursor-pointer font-rubik text-sm font-medium"
            >
              <Play
                className={cn(
                  "mr-2.5 inline-block h-3 w-3 fill-black duration-150",
                  activeStates.propertyType && "rotate-90",
                )}
              />
              Property Type
            </div>
            {activeStates.propertyType && (
              <div className="flex flex-col gap-1.5">
                {PropertyTypeEnum.map((type) => (
                  <div
                    key={type}
                    className={cn(
                      "flex cursor-pointer items-center justify-start rounded-md py-1.5 pl-5 pr-2 text-left font-rubik text-sm font-medium text-zinc-700 duration-100 hover:bg-blue-100",
                      propertyType === type && "bg-white text-blue-600",
                    )}
                    onClick={() => {
                      if (propertyType === type) {
                        setPropertyType(undefined);
                        router.push(
                          pathname +
                            "?" +
                            createQueryString({}, "property-type"),
                        );
                      } else {
                        setPropertyType(type);
                        router.push(
                          pathname +
                            "?" +
                            createQueryString({
                              "property-type": type
                                .replace("/", "-")
                                .replace("%2B", "+"),
                            }),
                        );
                      }
                    }}
                  >
                    <Checkbox
                      checked={propertyType === type}
                      className={cn(
                        "mr-2 h-4 w-4",
                        propertyType === type &&
                          "data-[state=checked]:border-transparent data-[state=checked]:bg-blue-500",
                      )}
                    />
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2.5">
            <div
              onClick={() =>
                setActiveStates((prev) => ({
                  ...prev,
                  roomType: !prev.roomType,
                }))
              }
              className="cursor-pointer font-rubik text-sm font-medium"
            >
              <Play
                className={cn(
                  "mr-2.5 inline-block h-3 w-3 fill-black duration-150",
                  activeStates.roomType && "rotate-90",
                )}
              />
              Room Type
            </div>
            {activeStates.roomType && (
              <div className="flex flex-col gap-1.5">
                {RoomTypeEnum.map((type) => (
                  <div
                    key={type}
                    className={cn(
                      "flex cursor-pointer items-center justify-start rounded-md py-1.5 pl-5 pr-2 text-left font-rubik text-sm font-medium text-zinc-700 duration-100 hover:bg-blue-100",
                      roomType === type && "bg-white text-blue-600",
                    )}
                    onClick={() => {
                      if (roomType === type) {
                        setRoomType(undefined);
                        router.push(
                          pathname + "?" + createQueryString({}, "room-type"),
                        );
                      } else {
                        setRoomType(type);
                        router.push(
                          pathname +
                            "?" +
                            createQueryString({
                              "room-type": type
                                .replace("/", "-")
                                .replace("%2B", "+"),
                            }),
                        );
                      }
                    }}
                  >
                    <Checkbox
                      checked={roomType === type}
                      className={cn(
                        "mr-2 h-4 w-4",
                        roomType === type &&
                          "data-[state=checked]:border-transparent data-[state=checked]:bg-blue-500",
                      )}
                    />
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2.5">
            <div
              onClick={() =>
                setActiveStates((prev) => ({
                  ...prev,
                  roomCategory: !prev.roomCategory,
                }))
              }
              className="cursor-pointer font-rubik text-sm font-medium"
            >
              <Play
                className={cn(
                  "mr-2.5 inline-block h-3 w-3 fill-black duration-150",
                  activeStates.roomCategory && "rotate-90",
                )}
              />
              Room Category
            </div>
            {activeStates.roomCategory && (
              <div className="flex flex-col gap-1.5">
                {RoomCategoryEnum.map((category) => (
                  <div
                    key={category}
                    className={cn(
                      "flex cursor-pointer items-center justify-start rounded-md py-1.5 pl-5 pr-2 text-left font-rubik text-sm font-medium text-zinc-700 duration-100 hover:bg-blue-100",
                      roomCategory === category && "bg-white text-blue-500",
                    )}
                    onClick={() => {
                      if (roomCategory === category) {
                        setRoomCategory(undefined);
                        router.push(
                          pathname +
                            "?" +
                            createQueryString({}, "room-category"),
                        );
                      } else {
                        setRoomCategory(category);
                        router.push(
                          pathname +
                            "?" +
                            createQueryString({
                              "room-category": category
                                .replace("/", "-")
                                .replace("%2B", "+"),
                            }),
                        );
                      }
                    }}
                  >
                    <Checkbox
                      checked={roomCategory === category}
                      className={cn(
                        "mr-2 h-4 w-4",
                        roomCategory === category &&
                          "data-[state=checked]:border-transparent data-[state=checked]:bg-blue-500",
                      )}
                    />
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-5 py-5 *:w-full">
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-5">
                <div className="flex animate-pulse space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-8 w-3/4 rounded bg-blue-200"></div>
                    <div className="space-y-2">
                      <div className="h-6 rounded bg-blue-200"></div>
                      <div className="h-6 w-5/6 rounded bg-blue-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {!loading && searchRooms?.data.length === 0 && (
            <div className="flex items-center justify-start gap-2 px-2.5 font-rubik text-lg font-semibold md:py-5">
              No results found for{" "}
              <span className="text-base text-blue-600">
                {location?.split(",")[0]}, {location?.split(",")[1]}
              </span>
            </div>
          )}
          {!loading && searchRooms?.data && searchRooms.data.length > 0 && (
            <div className="flex items-center justify-start gap-2 px-2.5 pb-2.5 text-left font-rubik text-base font-semibold md:pt-5">
              Showing search results for{" "}
              <span className="text-base text-blue-600">
                {location?.split(",")[0]}, {location?.split(",")[1]}
              </span>
            </div>
          )}
          {searchRooms?.data.map((prop, i) => {
            return (
              <Link
                href={
                  "rooms" + "?" + createQueryString({ "property-id": prop._id })
                }
                key={prop._id}
                className="relative grid w-full cursor-pointer grid-cols-5 rounded-xl bg-white p-3"
              >
                <div className="search relative col-span-2">
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
                    {prop.images.map((image, k) => (
                      <SwiperSlide key={k + image.url}>
                        <Avatar className="h-60 w-full rounded-xl">
                          <AvatarImage
                            src={image.url}
                            alt={image.label}
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
                <div className="col-span-2 flex flex-col justify-between p-5">
                  <div className="flex flex-col gap-1 *:w-full">
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
                    <h1 className="font-rubik text-xl font-semibold">
                      {prop.name}
                    </h1>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="max-w-md text-sm font-medium text-zinc-500">
                        {prop.address}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 *:w-full">
                    <h3 className="font-rubik text-sm font-medium">
                      Facilities:
                    </h3>
                    <div className="flex w-full flex-wrap items-center justify-start gap-1.5">
                      {Array.from({ length: 3 }).map((_, index) => {
                        if (prop.facilities.length > index) {
                          return (
                            <Badge key={index} variant={"default"}>
                              {prop.facilities[index]}
                            </Badge>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-end pb-5 pr-5">
                  {/* <h2 className="font-rubik text-xl font-semibold">
                      Rs.{" "}
                      {room.pricePerDay
                        ? room.pricePerDay + "/Day"
                        : room.pricePerMonth
                          ? room.pricePerMonth + "/Month"
                          : 0}
                    </h2> */}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Search;
