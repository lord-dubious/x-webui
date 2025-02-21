"use client";

import { ReactTyped } from "react-typed";
import { Code, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-black text-white pt-20 pb-0 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="inline-flex items-center justify-center gap-2 mb-4 px-3 py-1 rounded-full bg-gray-800">
          <Code size={20} className="text-blue-500 animate-pulse" />
          <span className="text-lg tracking-wide">Crafted by Devs for Devs</span>
        </p>
        <h1 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight mt-2">
          <ReactTyped
            strings={[
              "⏰ Too busy coding? Let Tweetly tweet for you!",
              "🤔 Unsure what to tweet? Spark your creativity with Tweetly!",
              "🚀 Elevate your Twitter game – schedule a month of tweets in minutes!"
            ]}
            typeSpeed={80}
            backSpeed={40}
            loop
          />
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
        Boost your dev vibe—Tweetly’s AI writes and schedules tweets in minutes, so you can code and shine on Twitter.
        </p>
        <a
          href="https://app.tweetly.in"
          target="_self"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md text-base font-medium transition"
        >
          <Sparkles size={18} className="mr-2 animate-bounce" />
          Try Tweetly
        </a>
      </div>
    </section>
  );
}
