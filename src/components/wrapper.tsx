import { cn } from "@/lib/utils";
import React, { FC, forwardRef, Ref } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

const Wrapper: FC<Props> = forwardRef<HTMLDivElement, Props>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("min-h-screen w-full bg-zinc-50", className)}
      >
        <div className="mx-auto flex max-w-screen-xl flex-col items-start justify-start gap-5 px-5 py-10 *:w-full">
          {children}
        </div>
      </div>
    );
  },
);

Wrapper.displayName = "Wrapper";

export default Wrapper;
