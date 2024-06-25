import { SVGProps } from "react";
import { cn } from "@/lib/utils";

interface TrashIconProps extends SVGProps<SVGSVGElement> {}

export function TimerIcon({ className, ...all }: Readonly<TrashIconProps>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="none"
      className={cn("text-green-500", className)}
      {...all}
    >
      <path
        d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
        fill="currentColor"
      />
    </svg>
  );
}
