"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const featuresData = [
  {
    title: "Brain",
    description: "A dedicated space to save all your tweets.",
    image: "/Brain1.jpg",
  },
  {
    title: "Bots",
    description: "AI bots trained to write your tweets for you.",
    image: "/Bots1.jpg",
  },
  {
    title: "Chats",
    description: "Engage in interactive chats with intelligent bots.",
    image: "/Chat1.jpg",
  },
  {
    title: "Publish",
    description: "Effortlessly publish your tweets with Tweetly.",
    image: "/Publish1.jpg",
  },
  {
    title: "Schedule",
    description: "Schedule and edit tweets seamlessly.",
    image: "/Schedule1.jpg",
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="rounded-lg p-8 shadow-lg transition-all duration-500">
        <div className="flex flex-col items-center">
          <div className="relative w-full mb-6">
            <Image
              src={currentFeature.image}
              alt={currentFeature.title}
              width={800}
              height={800}
              className="w-full rounded-2xl shadow-sm shadow-gray-50 transition-transform duration-500 ease-out transform hover:scale-105"
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-4  mb-2">
            {currentFeature.title}
          </h2>
          <p className="text-lg text-gray-300 mb-6 text-center max-w-3xl">
            {currentFeature.description}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {featuresData.map((feature, idx) => (
              <button
                key={idx}
                onClick={() => handleFeatureClick(idx)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  idx === currentIndex
                    ? "bg-blue-600 text-white"
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
