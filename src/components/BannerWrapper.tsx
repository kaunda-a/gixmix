"use client";

import { usePathname } from "next/navigation";
import Banner from "./Banner";

const BannerWrapper = () => {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <Banner
      id="welcome"
      message="\u2605 New: Check out our Weather App and Pok\u00e9dex Lookup tools!"
      linkText="Try them now"
      linkHref="/tools"
    />
  );
};

export default BannerWrapper;
