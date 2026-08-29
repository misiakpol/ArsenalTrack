"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, Settings } from "lucide-react";
import React from "react";

const Navbar = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
}) => {
  // Theme State Management
  const { setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 backdrop-blur sm:px-6">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-gray-800 md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <h1 className="flex shrink-0 items-center text-lg leading-none font-semibold tracking-tight text-gray-800 uppercase sm:text-xl md:hidden">
            Arsenal<span className="font-bold text-purple-600">Track</span>
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            type="button"
            // Removed the extra 'hover:border' at the end to fix the iOS mobile tap bug
            className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-transparent hover:border-purple-600 hover:bg-purple-100"
            onClick={toggleTheme}
          >
            {/* Swapped Moon and Sun so it makes logical visual sense */}
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-6 w-6 text-gray-800 group-hover:text-purple-600"></Sun>
            ) : (
              <Moon className="h-6 w-6 text-gray-800 group-hover:text-purple-600"></Moon>
            )}
          </button>

          <button
            type="button"
            className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-transparent hover:border-purple-600 hover:bg-purple-100"
          >
            <Settings className="h-6 w-6 text-gray-800 group-hover:text-purple-600" />
          </button>
          <span className="mx-2 h-8 w-0.5 bg-gray-300"></span>
          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-purple-700 text-sm font-medium text-white">
            U
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
