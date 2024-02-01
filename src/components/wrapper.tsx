import { cn } from "@/lib/utils";
import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Wrapper: FC<Props> = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen w-full bg-zinc-50", className)}>
      <div className="mx-auto flex max-w-screen-xl flex-col items-start justify-start gap-5 px-5 py-10 *:w-full">
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
