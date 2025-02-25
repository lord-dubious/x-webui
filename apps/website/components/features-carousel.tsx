"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const featuresData = [
  {
    title: "Brain",
    description: "A dedicated space to save all your tweets.",
    image: "https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUexNiNtFGZ8ejuvhlPcoHR2rBdUbzs9iMw4Kg",
  },
  {
    title: "Bots",
    description: "AI bots trained to write your tweets for you.",
    image: "https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUZpbJCmEc47LUgHpo5GeIyu2XbMa1RxwZqdEi",
  },
  {
    title: "Chats",
    description: "Engage in interactive chats with intelligent bots.",
    image: "https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUDyZNS7eoKceE4txni7wkXlqFapgHb6GCu9vA",
  },
  {
    title: "Publish",
    description: "Effortlessly publish your tweets with Tweetly.",
    image: "https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHURjglvcSNVjtTDCBbn20Khu9IUcSZM3LXzOiR",
  },
  {
    title: "Schedule",
    description: "Schedule and edit tweets seamlessly.",
    image: "https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUx5Vls9DFuHyEDPQ4rWRs12eht5xmb0VcYBqk",
  },
];

export default function FeaturesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuresData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFeatureClick = (index: number) => {
    setCurrentIndex(index);
  };

  const currentFeature = featuresData[currentIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-black">
      <div className="rounded-lg p-8 shadow-lg transition-all duration-500">
        <div className="flex flex-col items-center">
          <div className="relative w-full mb-6">
            {currentFeature && 
            (
            <Image
              src={currentFeature?.image}
              alt={currentFeature?.title}
              width={800}
              height={800}
              className="w-full rounded-2xl shadow-md shadow-gray-50 transition-transform duration-500 ease-out transform hover:scale-105"
            />
            )}
            
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-4  mb-2">
            {currentFeature?.title}
          </h2>
          <p className="text-lg text-gray-300 mb-6 text-center max-w-3xl">
            {currentFeature?.description}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {featuresData.map((feature, idx) => (
              <button
                key={idx}
                onClick={() => handleFeatureClick(idx)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  idx === currentIndex
                    ? "bg-customBlue text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
