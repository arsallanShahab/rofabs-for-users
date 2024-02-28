"use client";

import UiButton from "@/components/button";
import { useGlobalContext } from "@/components/context-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RoomCategoryEnum, RoomTypeEnum } from "@/lib/consts";
import { cn } from "@/lib/utils";
import {
  Autocomplete,
  AutocompleteItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Selection,
} from "@nextui-org/react";
import { differenceInDays, format } from "date-fns";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { CalendarIcon, SearchIcon } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Key, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type AutocompleteData = {
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  description: string;
  matched_substrings: {
    length: number;
    offset: number;
  }[];
  terms: {
    offset: number;
    value: string;
  }[];
  types: string[];
  reference: string;
};

const TabsConstants = Object.freeze({
  HOSTEL_PG: "Hostel/PG",
  HOTEL: "Hotel",
  APARTMENT: "Family Apartment",
});

export default function Home() {
  const { user, onOpen, isLoadingUser } = useGlobalContext();
  useEffect(() => {
    // First, ensure the user loading process is complete
    if (!isLoadingUser) {
      // Once loading is complete, check if the user is not logged in
      if (!user || !user.id) {
        onOpen(); // This opens the login modal if the user is not logged in
        // toast.error("Please login to continue.");
      }
    }
  }, [user, onOpen, isLoadingUser]); // Depends on user, onOpen, and isLoadingUser

  const router = useRouter();
  const searchParams = useSearchParams();

  const [popoverActiveCheckIn, setPopoverActiveCheckIn] = useState(false);
  const [popoverActiveCheckOut, setPopoverActiveCheckOut] = useState(false);

  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [roomCategory, setRoomCategory] = useState("");
  const [roomType, setRoomType] = useState<Selection>(new Set([]));
  const [location, setLocation] = useState<Key>("");
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<
    (typeof TabsConstants)[keyof typeof TabsConstants]
  >(TabsConstants.HOSTEL_PG);

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

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate)
      return toast.error("Please select check-in and check-out dates");
    if (!location) return toast.error("Please select a location");
    router.push(
      "/search" +
        "?" +
        createQueryString({
          "check-in": dayjs(checkInDate).format("YYYY-MM-DD"),
          "check-out": dayjs(checkOutDate).format("YYYY-MM-DD"),
          "room-category": Array.from(roomCategory).join(""),
          "room-type": Array.from(roomType).join(""),
          location: location.toString().split("&&")[0],
          "place-id": location.toString().split("&&")[1],
          "no-of-guests": numberOfGuests.toString(),
          "property-type":
            selectedTab.length > 0
              ? selectedTab.replace("/", "-").replace(" ", "+")
              : "",
        }),
    );
  };
  console.log(location, "selected location");

  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState<AutocompleteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const fetchItems = debounce(async (value) => {
    setIsLoading(true);
    setError(false);
    // Replace this with your actual fetch function
    try {
      const newItems = await fetchLocation(value);
      setItems(newItems);
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, 600); // 600ms delay

  useEffect(() => {
    if (inputValue.length > 0) {
      fetchItems(inputValue);
    } else {
      setItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const fetchLocation = async (input: string) => {
    // throw new Error("Function not implemented.");
    let res = await fetch(`/api/maps/autocomplete?input=${input}`);
    let json = await res.json();
    return json;
  };

  return (
    <>
      <Head>
        <title>Rofabs for users</title>
      </Head>
      <main
        className={`relative grid w-full grid-cols-1 bg-gradient-to-br from-sky-400 to-blue-800 pb-12 pt-5 sm:pb-20 sm:pt-20 md:grid-cols-2`}
      >
        <div className="relative hidden h-full w-full md:block">
          <div className="relative flex h-full w-full flex-col items-end justify-start gap-5 p-10">
            <h1 className="pr-5 text-right font-rubik text-6xl font-semibold text-white">
              Find the best hotels, resorts and more for your next stay.
            </h1>
            <p className="max-w-xl text-right text-2xl font-medium text-white">
              We have the best hotels, resorts and more for your next stay. We
              have the best hotels, resorts and more for your next stay.
            </p>
          </div>
        </div>
        <div className="px-2.5 py-5 pb-10 sm:px-10 sm:pb-5">
          <div className="relative flex h-full w-full max-w-xl flex-col items-start justify-center *:w-full sm:flex-row">
            <div className="-top-8 left-0 z-[99] flex w-full items-center justify-center pb-2.5 sm:absolute sm:pb-0">
              <div className="flex w-full max-w-md justify-center rounded-2xl bg-white p-5 text-center font-rubik shadow-[0_4px_30px_-12px_rgba(0,0,0,0.3)] *:flex-1 sm:rounded-[99px]">
                <div
                  onClick={() => setSelectedTab(TabsConstants.HOSTEL_PG)}
                  className={cn(
                    "cursor-pointer text-zinc-500",
                    selectedTab === TabsConstants.HOSTEL_PG &&
                      "font-medium text-zinc-950",
                  )}
                >
                  Hotel/PG
                </div>
                <div
                  onClick={() => setSelectedTab(TabsConstants.HOTEL)}
                  className={cn(
                    "cursor-pointer text-zinc-500",
                    selectedTab === TabsConstants.HOTEL &&
                      "font-medium text-zinc-950",
                  )}
                >
                  Hostels
                </div>
                <div
                  onClick={() => setSelectedTab(TabsConstants.APARTMENT)}
                  className={cn(
                    "cursor-pointer text-zinc-500",
                    selectedTab === TabsConstants.APARTMENT &&
                      "font-medium text-zinc-950",
                  )}
                >
                  Apartments
                </div>
              </div>
            </div>
            <form className="relative grid w-full grid-cols-1 gap-y-2 rounded-3xl bg-white px-5 pb-12 pt-7 shadow-[0_4px_30px_3px_rgba(0,0,0,0.15)] sm:grid-cols-2 sm:gap-x-5 sm:px-7 sm:py-14">
              <div className="relative col-span-1 grid w-full flex-1 grid-cols-1 items-center gap-2.5 sm:col-span-2 sm:flex">
                <Autocomplete
                  inputValue={inputValue}
                  isLoading={isLoading}
                  items={items}
                  label="Location"
                  labelPlacement="outside"
                  placeholder="Search for a location"
                  selectedKey={`${location && location}`}
                  onSelectionChange={(key) => {
                    setLocation(key);
                    setError(false);
                    if (key?.toString().length > 0) {
                      setInputValue(key?.toString()?.split("&&")[0]);
                    }
                  }}
                  // variant="bordered"
                  onInputChange={setInputValue}
                  startContent={
                    <SearchIcon
                      className="mr-1 text-default-400"
                      strokeWidth={2.5}
                      size={20}
                    />
                  }
                  clearButtonProps={{
                    onClick: () => {
                      setInputValue("");
                      setLocation("");
                      setItems([]);
                      setError(false);
                    },
                  }}
                  isInvalid={false}
                  errorMessage={error ? "Something went wrong" : ""}
                  inputProps={{
                    classNames: {
                      inputWrapper:
                        "px-4 h-auto shadow-none border-1 rounded-xl",
                      input: "py-3.5 text-black placeholder:text-zinc-500",
                      label: "font-medium text-lg -bottom-1.5",
                      base: "font-rubik",
                      errorMessage: "font-medium",
                    },
                  }}
                >
                  {(item) => (
                    <AutocompleteItem
                      key={`${item.structured_formatting.main_text},${item.structured_formatting.secondary_text}&&${item.place_id}`}
                      className="capitalize"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {item.structured_formatting.main_text}
                        </span>
                        <span className="text-sm text-default-500">
                          {item.structured_formatting.secondary_text}
                        </span>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <div className="flex w-full flex-col items-start gap-0 font-rubik sm:w-auto">
                  <Label className="text-lg">No of guests</Label>
                  <div className="flex w-full items-center gap-2 *:flex-1">
                    <UiButton
                      onClick={(e) => {
                        e.preventDefault();
                        setNumberOfGuests(numberOfGuests + 1);
                      }}
                      className="rounded-xl border bg-transparent py-3.5 text-zinc-500 hover:bg-zinc-100"
                    >
                      +
                    </UiButton>
                    <button className="px-3 py-3.5 text-lg">
                      {numberOfGuests}
                    </button>
                    <UiButton
                      onClick={(e) => {
                        e.preventDefault();
                        if (numberOfGuests > 1) {
                          setNumberOfGuests(numberOfGuests - 1);
                        }
                      }}
                      className="rounded-xl border bg-transparent py-3.5 text-zinc-500 hover:bg-zinc-100"
                    >
                      -
                    </UiButton>
                  </div>
                </div>
              </div>
              <div className="col-span-2 grid  grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className="flex w-auto flex-col items-start gap-1.5 font-rubik">
                  <Label className="text-lg">Check in</Label>
                  <Popover
                    showArrow
                    isDismissable
                    backdrop="blur"
                    isOpen={popoverActiveCheckIn}
                    onOpenChange={(open) => setPopoverActiveCheckIn(open)}
                  >
                    <PopoverTrigger>
                      <Button
                        variant={"secondary"}
                        className={cn(
                          "h-auto w-full justify-start rounded-xl border-1 px-4 py-3.5 text-left font-normal shadow-none",
                          !checkInDate && "text-zinc-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate ? (
                          format(checkInDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-[198] w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={(date) => {
                          setCheckInDate(date);
                          setPopoverActiveCheckIn(false);
                          // Close the popover here
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {checkInDate && checkOutDate && (
                  <Badge className="absolute left-[calc(50%-2.5em)] top-[calc(50%-1px)] z-50 px-2 py-1">
                    {differenceInDays(checkOutDate, checkInDate)}{" "}
                    {differenceInDays(checkOutDate, checkInDate) > 1
                      ? "Days"
                      : "Day"}
                  </Badge>
                )}
                <div className="flex w-auto flex-col items-start gap-1.5 font-rubik">
                  <Label className="text-lg">Check out</Label>
                  <Popover
                    showArrow
                    isDismissable
                    backdrop="blur"
                    isOpen={popoverActiveCheckOut}
                    onOpenChange={(open) => setPopoverActiveCheckOut(open)}
                  >
                    <PopoverTrigger>
                      <Button
                        variant={"secondary"}
                        className={cn(
                          "h-auto w-full justify-start rounded-xl border-1 px-4 py-3.5 pl-7 text-left font-normal shadow-none",
                          !checkOutDate && "text-zinc-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOutDate ? (
                          format(checkOutDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-[198] w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={(date: Date | undefined) => {
                          if (date && checkInDate) {
                            if (date > checkInDate) {
                              setCheckOutDate(date);
                              setPopoverActiveCheckOut(false);
                            } else {
                              setPopoverActiveCheckOut(false);
                              toast.error(
                                "Check-out date should be greater than check-in date",
                              );
                            }
                          } else {
                            setPopoverActiveCheckOut(false);
                            toast.error("Please select check-in date");
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {selectedTab === TabsConstants.HOSTEL_PG && (
                <div className="col-span-2 mt-2 grid  grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <Select
                    color="default"
                    label="Room Type"
                    labelPlacement="outside"
                    placeholder="Select Booking Type"
                    selectedKeys={roomType}
                    onSelectionChange={setRoomType}
                    // variant="bordered"
                    classNames={{
                      trigger:
                        "px-4 h-auto shadow-none border-1 py-3.5 rounded-xl",
                      innerWrapper: "placeholder:text-zinc-500 text-zinc-500",
                      value: "text-zinc-500",
                      base: "font-rubik",
                      label: "font-medium text-lg bottom-0.5",
                    }}
                  >
                    {RoomTypeEnum.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>
                  <div className="flex w-full flex-col justify-end gap-1.5 font-rubik">
                    <Label className="text-lg font-medium">Booking Type</Label>
                    <div className="grid w-full grid-cols-2 items-end gap-1.5 font-rubik font-medium ">
                      {RoomCategoryEnum.map((category) => (
                        <div
                          onClick={() => setRoomCategory(category)}
                          className={cn(
                            "flex-1 cursor-pointer rounded-xl border bg-zinc-100 px-5 py-3 text-center duration-100",
                            category === roomCategory &&
                              " bg-sky-500 text-white",
                          )}
                          key={category}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute -bottom-7 flex w-full items-center justify-center px-4 py-2">
                <button
                  onClick={handleSubmit}
                  className="rounded-[99px] bg-sky-500 px-10 py-3 font-rubik text-xl font-medium text-white shadow-[0_15px_30px_0px_rgba(0,0,0,0.2)] duration-100 hover:bg-sky-400 active:translate-y-1 active:scale-95 active:bg-sky-500"
                >
                  Search your stay
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <div className="mx-auto flex max-w-screen-2xl flex-col gap-20 px-7 py-10 *:w-full sm:px-10 sm:py-20">
        <div className="grid items-center gap-10 bg-white sm:grid-cols-2">
          <div className="h-[350px]">
            <Image
              src={"/images/apartments/comfyroom.jpg"}
              height={400}
              width={400}
              className="h-full w-full rounded-xl object-cover"
              alt="hero-image"
            />
          </div>
          <div className="flex flex-col items-start gap-7">
            <h1 className="max-w-xl font-sora text-3xl font-bold sm:text-5xl">
              Start living your best life from day one
            </h1>
            <p className="text-md max-w-lg font-medium text-gray-500 sm:text-xl">
              Bring a box full of hopes, dreams, ambitions... and of course,
              your personal belongings. Everything else - furniture, appliances,
              food - has already been taken care of.
            </p>
          </div>
        </div>
        <Swiper
          modules={[Autoplay]}
          // slidesPerView={3}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            // when window width is >= 640px
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            // when window width is >= 1200px
            1200: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          loop={true}
          navigation={true}
          className="mySwiper max-h-[400px]"
        >
          <SwiperSlide>
            <Image
              src={"/images/cities/bangalore.jpg"}
              height={400}
              width={400}
              className="h-full w-full rounded-xl object-cover"
              alt="hero-image"
            />
            <p className="mt-2.5 text-left font-rubik text-xl font-medium">
              Bangalore
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/images/cities/chennai.jpg"}
              height={400}
              width={400}
              className="h-full w-full rounded-xl object-cover"
              alt="hero-image"
            />
            <p className="mt-2.5 text-left font-rubik text-xl font-medium">
              Chennai
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/images/cities/delhi.jpg"}
              height={400}
              width={400}
              className="h-full w-full rounded-xl object-cover"
              alt="hero-image"
            />
            <p className="mt-2.5 text-left font-rubik text-xl font-medium">
              Delhi
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/images/cities/hyderabad.jpg"}
              height={400}
              width={400}
              className="h-full w-full rounded-xl object-cover"
              alt="hero-image"
            />
            <p className="mt-2.5 text-left font-rubik text-xl font-medium">
              Hyderabad
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/images/cities/mumbai.jpg"}
              height={400}
              width={400}
              className="h-full w-full rounded-xl object-cover"
              alt="hero-image"
            />
            <p className="mt-2.5 text-left font-rubik text-xl font-medium">
              Mumbai
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/images/cities/pune.jpg"}
              height={400}
              width={400}
              className="h-full w-full rounded-xl object-cover"
              alt="hero-image"
            />
            <p className="mt-2.5 text-left font-rubik text-xl font-medium">
              Pune
            </p>
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/images/cities/kolkata.jpg"}
              height={400}
              width={400}
              className="h-full w-full rounded-xl object-cover"
              alt="hero-image"
            />
            <p className="mt-2.5 text-left font-rubik text-xl font-medium">
              Kolkata
            </p>
          </SwiperSlide>
        </Swiper>
        <div className="flex flex-col gap-5 *:w-full">
          <h1 className="text-center font-sora text-3xl font-bold sm:text-5xl">
            Experience the Signature Stays
          </h1>
          <p className="mx-auto max-w-lg text-center text-medium font-medium text-gray-500 sm:text-lg">
            We have the best hotels, hostels and more for your next stay. From
            cozy country homes to funky city apartments, we have something for
            every taste and budget.
          </p>
          {/* //bento grid system */}
          <div className="mt-5 grid grid-cols-5 grid-rows-[200px] gap-5 pt-5">
            <div className="col-span-5 row-span-2 sm:col-span-3">
              <Image
                src={"/images/apartments/img1.jpg"}
                height={400}
                width={400}
                className="h-full w-full rounded-xl object-cover"
                alt="hero-image"
              />
            </div>
            <div className="col-span-3 row-span-1 sm:col-span-1">
              <Image
                src={"/images/apartments/img2.jpg"}
                height={300}
                width={300}
                className="h-full w-full rounded-xl object-cover"
                alt="hero-image"
              />
            </div>
            <div className="col-span-2 row-span-1 sm:col-span-1">
              <Image
                src={"/images/apartments/img3.jpg"}
                height={300}
                width={300}
                className="h-full w-full rounded-xl object-cover"
                alt="hero-image"
              />
            </div>
            <div className="col-span-2 row-span-1 sm:col-span-1">
              <Image
                src={"/images/apartments/pg1.jpg"}
                height={300}
                width={300}
                className="h-full w-full rounded-xl object-cover"
                alt="hero-image"
              />
            </div>
            <div className="col-span-3 row-span-1 sm:col-span-1">
              <Image
                src={"/images/apartments/pg2.png"}
                height={300}
                width={300}
                className="h-full w-full rounded-xl object-cover"
                alt="hero-image"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-10 rounded-xl bg-zinc-100 p-5 sm:grid-cols-2 sm:p-10">
          <Image
            src={"/images/hero-image.png"}
            height={400}
            width={400}
            className="h-full max-h-96 w-full rounded-xl object-contain"
            alt="hero-image"
          />
          <div className="flex flex-col items-center justify-center gap-5 text-center *:w-full sm:items-start sm:text-left">
            <h1 className="font-sora text-2xl font-bold sm:text-5xl">
              The future is flexible.
            </h1>
            <p className="max-w-lg p-5 pt-0 text-sm font-medium text-gray-500 sm:p-0 sm:text-lg">
              We believe in a world where finding a home is just a click away.
              Whether you&apos;re travelling for work or moving to a new city.
              Just bring your bags, and we&apos;ll handle your stay.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-5 *:w-full">
          <h3 className="font-sora text-3xl font-bold sm:text-5xl">
            Why Rofabs?
          </h3>
          <p className="max-w-xl text-medium font-medium text-gray-500 sm:text-lg">
            We have the best hotels, hostels and more for your next stay. From
            cozy country homes to funky city apartments, we have something for
            every taste and budget.
          </p>
        </div>
        <div className="flex flex-col items-end gap-5 *:w-full">
          <h3 className="text-right font-sora text-3xl font-bold sm:text-5xl">
            Rofabs: The future of living
          </h3>
          <p className="max-w-xl text-right text-medium font-medium text-gray-500 sm:text-lg">
            We believe in a world where finding a home is just a click away.
            Whether you&apos;re travelling for work or moving to a new city.
            Just bring your bags, and we&apos;ll handle your stay.
          </p>
        </div>
        <div className="flex flex-col gap-5 *:w-full">
          <h3 className="font-sora text-3xl font-bold sm:text-5xl">
            Not Better, But the Best
          </h3>
          <p className="max-w-xl text-medium font-medium text-gray-500 sm:text-lg">
            We have the best hotels, hostels and more for your next stay. From
            cozy country homes to funky city apartments, we have something for
            every taste and budget.
          </p>
        </div>
      </div>
    </>
  );
}

//shadow-[0px_5px_0px_0px_rgb(9,9,11)]
//shadow-[0_6px_30px_0px_rgba(0,0,0,0.5)]
