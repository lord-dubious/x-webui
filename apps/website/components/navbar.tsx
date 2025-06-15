"use client";

import { Button } from "@repo/ui/button";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-black text-white ">
      <div className="max-w-7xl mx-auto px-6 pt-4 flex items-center justify-between">
        <div className="flex items-center ">
          <Image src="https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHU2QWNPlyfmjfRU68YaiWIOdyEtVwNPohpD1J9" alt="XTask Logo" className="h-10 w-auto mr-2" title="logo" width={24} height={24} />
          <span className="text-3xl font-bold">XTask</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-blue-400 transition">
            Home
          </Link>

          <Link href="https://app.tweetly.in/" className="">
         
        <Button
        startIcon={<Sparkles size={18} className=" " />}
        variant="secondary"
        className="text-sm !py-2"
        >
          Try Tweetly
        </Button>
        </Link>
        </div>
      </div>
    </nav>
  );
}
