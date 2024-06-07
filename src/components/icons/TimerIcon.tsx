import { SVGProps } from "react";
import { cn } from "@/lib/utils";

interface TrashIconProps extends SVGProps<SVGSVGElement> {}

export function TimerIcon({ className, ...all }: Readonly<TrashIconProps>) {
  return (
    <svg
      width="31"
      height="37"
      viewBox="0 0 31 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-orange-500", className)}
      {...all}
    >
      <path
        d="M10.375 4.12516V0.708496H20.625V4.12516H10.375ZM13.7917 22.9168H17.2083V12.6668H13.7917V22.9168ZM15.5 36.5835C13.3931 36.5835 11.4071 36.1778 9.54219 35.3663C7.67726 34.5549 6.04722 33.4516 4.65208 32.0564C3.25694 30.6613 2.15365 29.0312 1.34219 27.1663C0.530729 25.3014 0.125 23.3154 0.125 21.2085C0.125 19.1016 0.530729 17.1156 1.34219 15.2507C2.15365 13.3858 3.25694 11.7557 4.65208 10.3606C6.04722 8.96544 7.67726 7.86214 9.54219 7.05068C11.4071 6.23923 13.3931 5.8335 15.5 5.8335C17.2653 5.8335 18.9594 6.11822 20.5823 6.68766C22.2052 7.25711 23.7285 8.0828 25.1521 9.16475L27.5438 6.77308L29.9354 9.16475L27.5438 11.5564C28.6257 12.98 29.4514 14.5033 30.0208 16.1262C30.5903 17.7491 30.875 19.4432 30.875 21.2085C30.875 23.3154 30.4693 25.3014 29.6578 27.1663C28.8464 29.0312 27.7431 30.6613 26.3479 32.0564C24.9528 33.4516 23.3227 34.5549 21.4578 35.3663C19.5929 36.1778 17.6069 36.5835 15.5 36.5835ZM15.5 33.1668C18.8028 33.1668 21.6215 31.9995 23.9562 29.6647C26.291 27.33 27.4583 24.5113 27.4583 21.2085C27.4583 17.9057 26.291 15.087 23.9562 12.7522C21.6215 10.4175 18.8028 9.25016 15.5 9.25016C12.1972 9.25016 9.37847 10.4175 7.04375 12.7522C4.70903 15.087 3.54167 17.9057 3.54167 21.2085C3.54167 24.5113 4.70903 27.33 7.04375 29.6647C9.37847 31.9995 12.1972 33.1668 15.5 33.1668Z"
        fill={"currentColor"}
      />
    </svg>
  );
}
