import { SVGProps } from "react";
import { cn } from "@/lib/utils";

interface TrashIconProps extends SVGProps<SVGSVGElement> {}

export function PlusIcon({ className, ...all }: Readonly<TrashIconProps>) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-green-500", className)}
      {...all}
    >
      <path
        d="M10.7917 14.2082H0.541748V10.7915H10.7917V0.541504H14.2084V10.7915H24.4584V14.2082H14.2084V24.4582H10.7917V14.2082Z"
        fill={"currentColor"}
      />
    </svg>
  );
}
