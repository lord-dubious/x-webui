"use client";

import { Sparkles } from "lucide-react";
import { GridBackgroundDemo } from "./grid-background";
import { Button } from "@repo/ui/button";
import Badge from "./ui/badge";
import Link from "next/link";
import { ReactTyped } from "react-typed";

export default function HeroSection() {
  return (
    <GridBackgroundDemo>
      <section className="text-white pt-20 pb-0 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge />
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            XTask helps you write & schedule tweets{" "}  with AI Personalities that{" "}
            <span className="text-customBlue">
             
              <ReactTyped
                strings={["inspire", "engage", "elevate"]}
                typeSpeed={80}
                backSpeed={40}
                loop
              />
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Boost your dev vibe—Tweetly’s AI writes and schedules tweets in minutes, so you can code and shine on Twitter.
          </p>
          <Link href="https://app.xtask.app/">
            <Button
              startIcon={<Sparkles size={18} className="animate-bounce" />}
              variant="secondary"
              className="p-2 text-lg mx-auto !bg-customPurple !text-white"
            >
              Try XTask
            </Button>
          </Link>
        </div>
      </section>
    </GridBackgroundDemo>
    // Comment
  );
}
