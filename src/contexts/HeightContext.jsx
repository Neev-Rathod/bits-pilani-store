// src/contexts/HeightContext.jsx

import React, { createContext, useState, useEffect } from "react";

// Create the context
export const HeightContext = createContext();

// Create the provider component
export function HeightProvider({ children }) {
  const [height, setHeight] = useState(getHeight());

  function getHeight() {
    return window.innerWidth >= 1024
      ? "calc(100dvh - 56px)"
      : "calc(100dvh - 120px)";
  }

  useEffect(() => {
    const handleResize = () => setHeight(getHeight());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <HeightContext.Provider value={{ height }}>
      {children}
    </HeightContext.Provider>
  );
}
