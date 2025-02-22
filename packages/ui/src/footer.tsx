"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" w-full text-gray-300 py-8 border-t border-opacity-20 border-gray-50  flex justify-between items-center px-16 h-24">
      
      <a href="https://tweetly.in" className="cursor-pointer ">
        <div className="flex items-center  mb-4 md:mb-0">
            
          <img src="/logo.jpg" alt="Tweetly Logo" className="h-12" />
          
          <span className="text-2xl font-bold text-white ">Tweetly</span>
       
        </div>
        </a>
        <div className="flex space-x-6 mb-4 md:mb-0">
          <Link href="/" className="hover:text-blue-400 transition">
            Home
          </Link>
        </div>
        <div className="text-sm">
          © {new Date().getFullYear()} Tweetly. All rights reserved.
        </div>
    
    </footer>
  );
}
