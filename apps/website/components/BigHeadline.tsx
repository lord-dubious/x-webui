"use client";

import { useEffect, useState } from "react";

export default function BigHeadline() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100); // Small delay for effect
  }, []);

  return (
    <section className="bg-black text-white pt-16 pb-24 px-6 md:px-12 lg:px-32">
      <div className="mx-auto text-left max-w-5xl">
        <h1
          className={`text-5xl md:text-8xl font-light !leading-snug transform transition-all duration-1000  ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          AI-powered tweets, <br />
       <span className=" bg-customBlue rounded-md px-2 ">effortless engagement, </span> <br />
          and hands-free growth.
        </h1>
        <p
          className={`mt-6 text-lg md:text-2xl text-gray-300 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Let Tweetly handle your Twitter game while you focus on coding. 
          Generate, schedule, and grow.
        </p>
      </div>
    </section>
  );
}
