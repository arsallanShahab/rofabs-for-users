import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="mx-auto max-w-screen-2xl px-7 py-20 sm:px-20">
      <div className="grid grid-cols-2 gap-7 sm:grid-cols-5">
        <div className="col-span-2">
          <h3 className="font-rubik font-medium text-zinc-950">Contact Us</h3>
          <div className="flex flex-col gap-2 pt-3 text-sm font-medium">
            <p className="flex items-center justify-start gap-2 text-gray-500">
              <MapPin className="h-4 w-4" />
              2nd FLoor,S.No 73/74/75P,Madhapur
            </p>
            <p className="flex items-center justify-start gap-2 text-gray-500">
              <Mail className="h-4 w-4" />
              rofabspartners@gmail.com
            </p>
            <p className="flex items-center justify-start gap-2 text-gray-500">
              <Phone className="h-4 w-4" />
              +91 7036081038
            </p>
          </div>
        </div>
        <div className="col-span-1">
          <h3 className="font-rubik font-medium text-zinc-950">Explore</h3>
          <div className="flex flex-col gap-2 pt-3 text-sm font-medium">
            <Link
              href="/about"
              className="text-gray-500 duration-100 hover:translate-x-2  hover:text-black"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-gray-500 duration-100 hover:translate-x-2  hover:text-black"
            >
              Contact Us
            </Link>
            <Link
              href="/careers"
              className="text-gray-500 duration-100 hover:translate-x-2  hover:text-black"
            >
              Careers
            </Link>
          </div>
        </div>
        <div className="col-span-1">
          <h3 className=" font-rubik font-medium text-zinc-950">
            Terms & Conditions
          </h3>
          <div className="flex flex-col gap-2 pt-3 text-sm font-medium">
            <Link
              href="/terms-and-conditions"
              className="text-gray-500 duration-100 hover:translate-x-2  hover:text-black"
            >
              Terms of Use
            </Link>
            <Link
              href="/privacy-policy"
              className="text-gray-500 duration-100 hover:translate-x-2  hover:text-black"
            >
              Privacy Policy
            </Link>
            <Link
              href="/faq"
              className="text-gray-500 duration-100 hover:translate-x-2  hover:text-black"
            >
              FAQ
            </Link>
          </div>
        </div>
        <div className="col-span-1">
          <h3 className=" font-rubik font-medium text-zinc-950">
            Social Media
          </h3>
          <div className="flex flex-col gap-2 pt-3 text-sm font-medium">
            <Link
              href="/"
              className="flex items-center justify-start  gap-2 text-gray-500 duration-100 hover:translate-x-2 hover:text-black"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Link>
            <Link
              href="/"
              className="flex items-center justify-start  gap-2 text-gray-500 duration-100 hover:translate-x-2 hover:text-black"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </Link>
            <Link
              href="/"
              className="flex items-center justify-start  gap-2 text-gray-500 duration-100 hover:translate-x-2 hover:text-black"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
