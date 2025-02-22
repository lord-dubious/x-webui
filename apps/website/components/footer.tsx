"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" text-gray-300 py-8 border-t border-opacity-10 border-gray-50 bg-black">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <img src="/logo.jpg" alt="Tweetly Logo" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-white">Tweetly</span>
        </div>
        <div className="flex space-x-6 mb-4 md:mb-0">
          <Link href="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link href="/features" className="hover:text-blue-400 transition">
            Features
          </Link>
          <Link href="/about" className="hover:text-blue-400 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-400 transition">
            Contact
          </Link>
        </div>
        <div className="text-sm">
          © {new Date().getFullYear()} Tweetly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
