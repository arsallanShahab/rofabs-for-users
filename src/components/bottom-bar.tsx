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
    if (document.body) {
      document.body.style.paddingBottom = "100px";
    }
    // if (current) {
    //   document.body.style.paddingBottom = `${current.clientHeight}px`;
    //   console.log(ref.current?.clientHeight);
    // }
  }, []);
  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-[99] flex border bg-white
  px-1.5 py-1 font-rubik shadow-[0_-0px_-6px_-1px_rgba(0,0,0,0.2),0_-2px_-4px_-2px_rgbs(0,0,0,0.1)] *:flex *:flex-1 *:flex-col *:items-center *:justify-center *:text-center *:font-medium sm:hidden 
  "
    >
      <Link
        href={"/"}
        className={cn(
          "rounded-xl px-2 py-3 text-zinc-600 duration-100 hover:bg-zinc-100",
          pathname === "/" && "text-black",
        )}
      >
        <Home
          size={24}
          className={cn(
            "h-6 w-6 duration-100",
            pathname === "/" && "h-7 w-7 text-black",
          )}
        />
        Home
      </Link>
      <Link
        href={"/search"}
        className={cn(
          "rounded-xl px-2 py-3 text-zinc-600 duration-100 hover:bg-zinc-100",
          pathname === "/" && "text-black",
        )}
      >
        <Search
          size={24}
          className={cn(
            "h-6 w-6 duration-100",
            pathname === "/search" && "h-7 w-7 text-black",
          )}
        />
        Search
      </Link>
      <Link
        href={"/"}
        className={cn(
          "rounded-xl px-2 py-3 duration-100 hover:bg-zinc-100",
          pathname === "/" && "text-black",
        )}
      >
        <BadgePercent
          className={cn(
            "h-9 w-9 rounded-2xl bg-black p-1 text-zinc-100 duration-100",
            pathname === "/offers" && "h-7 w-7 text-white",
          )}
        />
        offers
      </Link>
      <Link
        href={"/bookings/me"}
        className={cn(
          "rounded-xl px-2 py-3 text-zinc-600 duration-100 hover:bg-zinc-100",
          pathname === "/bookings/me" && "text-black",
        )}
      >
        <Ticket
          size={24}
          className={cn(
            "h-6 w-6 duration-100",
            pathname === "/bookings/me" && "h-7 w-7 text-black",
          )}
        />
        Bookings
      </Link>
      <Link
        href={"/profile"}
        className={cn(
          "rounded-xl px-2 py-3 text-zinc-600 duration-100 hover:bg-zinc-100",
          pathname === "/profile" && "text-black",
        )}
      >
        <User2
          size={24}
          className={cn(
            "h-6 w-6 duration-100",
            pathname === "/profile" && "h-7 w-7 text-black",
          )}
        />
        Profile
      </Link>
    </div>
  );
};

export default BottomBar;
