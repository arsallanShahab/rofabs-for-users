import Wrapper from "@/components/wrapper";
import { Checkbox, Input, Textarea } from "@nextui-org/react";
import {
  Facebook,
  Instagram,
  Landmark,
  Mail,
  MapPin,
  PhoneCall,
  PinIcon,
  Twitter,
} from "lucide-react";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center gap-5 px-5 py-7">
        <h1 className="font-sora text-5xl font-extrabold">Contact Us</h1>
        <p className="text-center text-lg font-medium text-gray-500">
          Any question or remarks? Just write us a message!
        </p>
      </div>
      <div className="grid grid-cols-7 rounded-xl border bg-white p-3 sm:min-h-[600px]">
        <div className="col-span-7 flex flex-col items-start justify-between gap-10 rounded-xl bg-indigo-600 p-10 sm:col-span-3">
          <div>
            <h1 className="font-sora text-3xl font-medium text-white">
              Contact Information
            </h1>
            <p className="text-left font-normal text-white/75">
              Say something to start a live chat!
            </p>
          </div>
          <div className="flex flex-col items-start justify-start gap-7">
            <p className="flex items-center gap-4 text-lg font-medium text-white">
              <Mail size={20} />
              <a
                href="mailto:jay@gmail.com"
                className="font-rubik text-sm font-light text-white"
              >
                jay@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-4 text-lg font-medium text-white">
              <PhoneCall size={20} />
              <a
                href="tel:+1234567890"
                className="font-rubik text-sm font-light text-white"
              >
                +1234567890
              </a>
            </p>
            <p className="flex items-center gap-4 text-lg font-medium text-white">
              <MapPin size={20} />
              <a
                href="https://goo.gl/maps/3zrQb8jGj8C2"
                target="_blank"
                rel="noopener noreferrer"
                className="font-rubik text-sm font-light text-white"
              >
                1234 Street Name, City Name, Country Name
              </a>
            </p>
          </div>
          <div className="flex items-center justify-start gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-[56px] bg-zinc-800 text-white duration-100 hover:bg-white  hover:text-black"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-[56px] bg-zinc-800 text-white duration-100 hover:bg-white hover:text-black"
            >
              <Twitter size={20} />
            </a>

            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-[56px] bg-zinc-800 text-white duration-100 hover:bg-white hover:text-black"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
        <div className="col-span-7 flex flex-col items-start justify-start gap-10 p-5 *:w-full sm:col-span-4 sm:p-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="First Name"
              // placeholder="Enter your first name"
              // labelPlacement="outside"
              variant="underlined"
              classNames={{
                base: "font-rubik",
              }}
              // size="lg"
            />
            <Input
              label="Last Name"
              // placeholder="Enter your last name"
              // labelPlacement="outside"
              variant="underlined"
              classNames={{
                base: "font-rubik",
              }}
              // size="lg"
            />
            <Input
              type="email"
              label="Email"
              // placeholder="Enter your email address"
              // labelPlacement="outside"
              variant="underlined"
              classNames={{
                base: "font-rubik",
              }}
              // size="lg"
            />
            <Input
              type="tel"
              label="Phone Number"
              // placeholder="Enter your phone number"
              // labelPlacement="outside"
              variant="underlined"
              classNames={{
                base: "font-rubik",
              }}
              // size="lg"
            />
          </div>
          <div className="flex flex-col justify-start gap-3">
            <p className="font-rubik text-sm font-semibold text-black">
              Select subject?
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Checkbox color="default" radius="full">
                <span className="text-sm font-medium text-black">
                  General Inquiry
                </span>
              </Checkbox>
              <Checkbox color="default" radius="full">
                <span className="text-sm font-medium text-black">
                  Partnership
                </span>
              </Checkbox>
              <Checkbox color="default" radius="full">
                <span className="text-sm font-medium text-black">Support</span>
              </Checkbox>

              <Checkbox color="default" radius="full">
                <span className="text-sm font-medium text-black">Other</span>
              </Checkbox>
            </div>
          </div>
          <div className="flex flex-col justify-start gap-7 *:w-full">
            {/* <p className="font-rubik text-sm font-semibold text-black">
              Message
            </p> */}
            <Textarea
              label="Message"
              variant="underlined"
              labelPlacement="outside"
              placeholder="Enter your message"
              classNames={{
                innerWrapper: "w-full",
              }}
            ></Textarea>
            <div className="flex items-center justify-end">
              <button className="flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-7 font-rubik font-medium text-white">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Page;
