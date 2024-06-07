import { SVGProps } from "react";
import { cn } from "@/lib/utils";

interface TrashIconProps extends SVGProps<SVGSVGElement> {}

export function TrashIcon({ className, ...all }: Readonly<TrashIconProps>) {
  return (
    <svg
      width="30"
      height="34"
      viewBox="0 0 30 34"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-destructive", className)}
      {...all}
    >
      <path
        fill={"currentColor"}
        d="M5.6155 34C4.61817 34 3.76617 33.6468 3.0595 32.9405C2.35317 32.2338 2 31.3818 2 30.3845V4.99996H0V1.99996H9V0.230957H21V1.99996H30V4.99996H28V30.3845C28 31.3948 27.65 32.25 26.95 32.95C26.25 33.65 25.3948 34 24.3845 34H5.6155ZM25 4.99996H5V30.3845C5 30.5641 5.05767 30.7116 5.173 30.827C5.28833 30.9423 5.43583 31 5.6155 31H24.3845C24.5385 31 24.6795 30.9358 24.8075 30.8075C24.9358 30.6795 25 30.5385 25 30.3845V4.99996ZM9.808 27H12.8075V8.99996H9.808V27ZM17.1925 27H20.192V8.99996H17.1925V27Z"
      />
    </svg>
  );
}
