import Image from "next/image";
import icon_v1_dark from "../../assets/iocn_v1_dark.png";

import React from "react";
import Footer from "@repo/ui/footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col  w-full min-h-screen !overflow-auto">
      <div className="flex justify-center items-center gap-1 py-2 h-32">
          <Image
            src={icon_v1_dark}
            className="w-[50px] cursor-pointer  brightness-0 dark:invert"
            alt="logo"
            width={50}
            height={50}
          />
          <h1 className="text-4xl font-bold cursor-pointer">Tweetly</h1>
        </div>
<div className="flex-grow pb-12 flex justify-center">
      {children}
      </div>

      <Footer />

    </div>
  );
};

export default Layout;
