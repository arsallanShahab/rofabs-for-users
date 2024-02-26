import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center px-5 py-10">
      <Loader2 className="h-6 w-6 animate-spin text-zinc-900" />
    </div>
  );
};

export default Loading;
