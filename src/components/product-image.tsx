"use client";

import { Package } from "lucide-react";

export function ProductImage({
  src,
  alt,
  className = "",
  iconClassName = "h-12 w-12 text-blue-800",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={`object-cover w-full h-full ${className}`} />
    );
  }
  return <Package className={iconClassName} />;
}
