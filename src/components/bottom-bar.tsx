import { cn } from "@/lib/utils";
import { BadgePercent, Home, Search, Ticket, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect, useRef } from "react";

const BottomBar: FC = () => {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;
    if (!current) return;
    document.body.style.paddingBottom = `${current.offsetHeight}px`;
  }, []);
  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-[99] flex bg-indigo-950
  px-1.5 py-4 font-rubik shadow-[0_-0px_-6px_-1px_rgba(0,0,0,0.2),0_-2px_-4px_-2px_rgbs(0,0,0,0.1)] *:flex *:flex-1 *:flex-col *:items-center *:justify-center *:text-center *:font-medium *:text-white sm:hidden 
  "
    >
      <Link
        href={"/"}
        className={cn("rounded-xl px-2 py-3 duration-100 hover:bg-indigo-900")}
      >
        <Home
          size={24}
          className={cn(
            "h-6 w-6 duration-100",
            pathname === "/" && "h-7 w-7 text-indigo-300",
          )}
        />
        Home
      </Link>
      <Link
        href={"/search"}
        className={cn("rounded-xl px-2 py-3 hover:bg-indigo-900")}
      >
        <Search
          size={24}
          className={cn(
            "h-6 w-6 duration-100",
            pathname === "/search" && "h-7 w-7 text-indigo-300",
          )}
        />
        Search
      </Link>
      <Link
        href={"/"}
        className={cn("rounded-xl px-2 py-3 hover:bg-indigo-900")}
      >
        <BadgePercent
          size={24}
          className={cn(
            "h-6 w-6 duration-100",
            pathname === "/offers" && "h-7 w-7 text-indigo-300",
          )}
        />
        offers
      </Link>
      <Link
        href={"/my-bookings"}
        className={cn("rounded-xl px-2 py-3 hover:bg-indigo-900")}
      >
        <Ticket
          size={24}
          className={cn(
            "h-6 w-6 duration-100",
            pathname === "/my-bookings" && "h-7 w-7 text-indigo-300",
          )}
        />
        Bookings
      </Link>
      <Link
        href={"/profile"}
        className={cn("rounded-xl px-2 py-3 hover:bg-indigo-900")}
      >
        <User2
          size={24}
          className={cn(
            "h-6 w-6 duration-100",
            pathname === "/profile" && "h-7 w-7 text-indigo-300",
          )}
        />
        Profile
      </Link>
    </div>
  );
};

export default BottomBar;
