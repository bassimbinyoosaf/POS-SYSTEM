import { useEffect, useState } from "react";
import { isAuthenticated } from "../utils/auth";

export default function AuthGate({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // allow browser to read storage first
    setTimeout(() => setReady(true), 50);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef2f7]">
        <div className="text-gray-500 text-sm">Loading session...</div>
      </div>
    );
  }

  return children;
}
