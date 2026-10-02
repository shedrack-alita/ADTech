import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_ASPECT_RATIO = 400 / 200;


export function Logo({
  className,
  light = false,
  height = 60,
}: {
  className?: string;
  light?: boolean;
  height?: number;
}) {
  return (
    <Image
      src={light ? "/images/logo/logo-white.png" : "/images/logo/logo-nvb.png"}
      alt="Amplify Digital Technologies"
      width={Math.round(height * LOGO_ASPECT_RATIO)}
      height={height}
      priority
      className={cn("h-9 w-auto object-contain", className)}
    />
  );
}
