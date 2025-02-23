"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Github } from "lucide-react";

export default function OpenSourceSection() {

  useEffect(() => {
    // Small delay for fade-in effect
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  return (
    <section className="w-full py-16 bg-black overflow-hidden relative text-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div
          className={`flex flex-col items-center transition-all duration-1000`}
        >
          <Github size={48} className="mb-4 text-customBlue" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Open Source &amp; Community Driven
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Productly is proudly open source! Our library is built with a passion for
            transparency and collaboration. We invite developers from around the world
            to contribute, improve, and innovate together. Join our community and help shape
            the future of this platform.
          </p>
          <Link
            href="https://github.com/your-repo-url"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-customBlue hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors duration-300"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}
