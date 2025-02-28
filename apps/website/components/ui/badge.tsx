import { Code } from "lucide-react";
import React from "react";

const Badge = () => {
  return (
    <div className="inline-flex items-center justify-center gap-2 mb-4 px-3 py-1 rounded-full bg-white text-sm">

        <Code size={20} className="text-black animate-pulse" />
        <span className="  text-gray-800 tracking-wide text-sm">Crafted by Devs for Devs</span>

    </div>
  );
};

export default Badge;
