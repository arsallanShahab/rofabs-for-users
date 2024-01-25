"use client";

import { PropertyTypeEnum } from "@/lib/consts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { FC } from "react";
import UiButton from "./button";
import { Button } from "./ui/button";

type Props = {};

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Hostel & PG's",
    href: "/search?property-type=" + PropertyTypeEnum[0].replace("/", "-"),
  },
  {
    name: "Hotel",
    href: "/search?property-type=" + PropertyTypeEnum[1],
  },
  {
    name: "Homestays",
    href: "/search?property-type=" + PropertyTypeEnum[2].replace(" ", "+"),
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "FAQ's",
    href: "/faqs",
  },
];

const Navbar: FC = (props: Props) => {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "sticky top-0 z-[99] mx-auto max-w-screen-2xl bg-white",
        pathname === "/" && "relative",
      )}
    >
      <div className="flex items-center justify-between border-b px-10 py-5 backdrop-blur-sm">
        <Link href="/" className="font-sora font-semibold">
          Rofabs
        </Link>
        <div className="hidden items-center justify-center gap-2.5 sm:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "rounded-md px-2 py-1.5 font-rubik text-sm font-medium duration-100 hover:bg-zinc-100",
                pathname === link.href && "bg-zinc-100",
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-end">
          <Button variant={"outline"} className="rounded-lg">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
