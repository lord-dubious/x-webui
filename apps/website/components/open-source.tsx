"use client";

import { Github } from "lucide-react";
import { Button } from "@repo/ui/button";

export default function OpenSourceSection() {
  return (
    <div className="bg-black">
      <section className="relative py-16 text-white overflow-hidden w-3/4 mx-auto">
        {/* Radial Gradient Background */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(29,31,47,0.6),_rgba(0,0,0,1))]" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center px-4">
          {/* Left Column: GitHub Icon */}
          <div className="flex flex-col items-center md:items-start">
            <div className="p-4 rounded-full bg-customBlue/10">
              <Github size={48} className="text-customBlue" />
            </div>
          </div>

          {/* Middle Column: Headline */}
          <div className="text-center md:text-center">
            <h2 className="text-3xl sm:text-4xl md:text-3xl font-extrabold">
              Tweetly is Open Source
            </h2>
          </div>

          {/* Right Column: CTA Button */}
          <div className="flex md:justify-end justify-center">
            <Button variant="secondary" className="text-lg">
              View on GitHub
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
