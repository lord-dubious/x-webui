"use client";

import Image from "next/image";
import { Twitter } from "lucide-react";

const bots = [
  {
    name: "Harkirt Singh",
    tag: "WebDev Pro",
    imageURL:
      "https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUqHfP7Rnl9wnFcHKMDCJeG8YL1PBAZdusXNkb",
    twitterLink: "https://x.com/kirat_tw",
  },
  {
    name: "Striver Aka Raj",
    tag: "DSA Pro",
    imageURL:
      "https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHU8uO1uol54znUSPNkOp63h9avt01mJibEA2qM",
    twitterLink: "https://x.com/striver_79",
  },
  {
    name: "Code With Harry",
    tag: "Best Teacher",
    imageURL:
      "https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUNOl0tGZbjrC4A30iB7c9Kt6Ul5wp8meLvh1D",
    twitterLink: "https://x.com/codewithharry",
  },
  {
    name: "EzSnippet",
    tag: "Build In Public Pro",
    imageURL:
      "https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUVxAvwBQ6eiS7bTFZPBLxaO1rj0QWlwup2YG3",
    twitterLink: "https://x.com/ezSnippet",
  },
];

export default function BotsMarquee() {
  return (
  
    <section className="w-full py-16  pb-32 overflow-hidden relative text-center">
      <div className="absolute inset-0 pointer-events-none" />

      {/* Headline */}
      <div className="mb-24">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          Meet the Pros Who <span className="bg-customBlue p-2 rounded-md">Tweet Smart </span> 
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mt-4">
        Need inspiration? Stuck on wording? These AI-powered bots help you craft engaging tweets in seconds.
        </p>
      </div>

      {/* Marquee Section */}
      <div className="whitespace-nowrap animate-marquee ">
        {bots.concat(bots).map((bot, idx) => (
          <div
            key={idx}
            className="inline-block mx-4 text-center text-white min-w-[250px] transition-transform duration-300 hover:scale-105 bg-gray-950  pb-3 rounded-md"
          >
            <div className="w-24 h-24 relative mx-auto mb-4 -mt-6">
              <Image
                src={bot.imageURL}
                alt={bot.name}
                fill
                className="object-cover rounded-full border border-white"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">{bot.name}</h3>
            <p className="text-xs mb-3">{bot.tag}</p>
            <a
              href={bot.twitterLink}
              target="_self"
              rel="noopener noreferrer"
              className="inline-block text-white hover:text-gray-300 transition"
            >
              <Twitter size={20} />
            </a>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%) ;
          }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </section>
  );
}
