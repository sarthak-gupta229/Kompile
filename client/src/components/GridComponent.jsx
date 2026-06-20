import { cn } from "../lib/utils";
import React from "react";

function GridComponent({ children }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-black">
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "bg-[size:20px_20px]",
          "bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="relative z-20 w-full h-full">{children}</div>
    </div>
  );
}
export default GridComponent;
