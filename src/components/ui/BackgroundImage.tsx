import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Full-bleed photo with a navy scrim, for hero/banner sections. The parent
 * must be `relative overflow-hidden`; put content in a `relative` sibling.
 */
export function BackgroundImage({
  src,
  priority = false,
  scrim = "bg-brand-navy/80",
  className,
}: {
  src: string;
  priority?: boolean;
  scrim?: string;
  className?: string;
}) {
  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className={cn("object-cover", className)}
      />
      <div className={cn("absolute inset-0", scrim)} />
    </>
  );
}
