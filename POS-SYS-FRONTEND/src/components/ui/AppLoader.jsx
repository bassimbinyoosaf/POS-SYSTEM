import React from "react";

export default function AppLoader({ text = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">

        {/* Logo Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-2xl bg-indigo-600 opacity-20 animate-ping"></div>

          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="white" strokeWidth="1.6"/>
              <path d="M12 21V12" stroke="white" strokeWidth="1.6"/>
              <path d="M20 7.5L12 12L4 7.5" stroke="white" strokeWidth="1.6"/>
            </svg>
          </div>
        </div>

        {/* Text */}
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          {text}
        </p>

      </div>
    </div>
  );
}
