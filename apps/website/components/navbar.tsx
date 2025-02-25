"use client";

import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-black text-white border-b border-opacity-20 border-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center ">
          <Image src="https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUQjQF1sv1N097MgFkwydKY3rmbRif5EsltJ6Q" alt="Tweetly Logo" className="h-12 w-auto" title="logo" width={24} height={24} />
          <span className="text-3xl font-bold">Tweetly</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          {/* <Link href="#features" className="hover:text-blue-400 transition">
            Features
          </Link>
          <Link href="#bots" className="hover:text-blue-400 transition">
            Bots
          </Link> */}
          <Link
            href="https://app.tweetly.in"
            className="bg-customBlue px-5 py-2 rounded-md font-medium transition"
          >
            Try Tweetly
          </Link>
        </div>
      </div>
    </nav>
  );
}
