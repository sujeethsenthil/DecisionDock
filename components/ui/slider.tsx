"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#D0D5DD]">
      <SliderPrimitive.Range className="absolute h-full bg-[#3B82F6]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-11 w-11 touch-manipulation rounded-full border-2 border-[#3B82F6] bg-white shadow-sm transition-[transform,box-shadow] duration-150 ease-out hover:scale-110 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:h-5 sm:w-5" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
