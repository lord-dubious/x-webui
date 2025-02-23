"use client";

import Link from "next/link";
import { Github } from "lucide-react";

export default function OpenSourceSection() {
  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Github size={48} className="mx-auto mb-6 text-customBlue" />
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Tweetly is Open Source
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Built with a passion for transparency and collaboration, Tweetly is proudly open source.
          We welcome developers around the globe to contribute, improve, and help shape the future of our platform.
        </p>
        <Link
          href="https://github.com/avishmadaan/tweetly"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-customBlue  text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
        >
          <span className="mr-2">View on GitHub</span>
        </Link>
      </div>
    </section>
  );
}
