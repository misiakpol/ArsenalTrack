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

      <div className="sticky shrink-0 top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white backdrop-blur px-4 sm:px-6">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-800 shrink-0"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <h1 className="flex items-center leading-none text-lg sm:text-xl tracking-tight uppercase font-semibold text-gray-800 md:hidden shrink-0">
            Arsenal<span className="font-bold text-purple-600">Track</span>
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-1 sm:gap-3 ml-auto shrink-0">
          <button
            type="button"
            // Removed the extra 'hover:border' at the end to fix the iOS mobile tap bug
            className="group flex items-center justify-center h-8 w-8 rounded-md border border-transparent hover:bg-purple-100 hover:border-purple-600 cursor-pointer"
            onClick={toggleTheme}
          >
            {/* Swapped Moon and Sun so it makes logical visual sense */}
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="w-6 h-6 text-gray-800 group-hover:text-purple-600"></Sun>
            ) : (
              <Moon className="w-6 h-6 text-gray-800 group-hover:text-purple-600"></Moon>
            )}
          </button>

          <button
            type="button"
            className="group flex items-center justify-center h-8 w-8 rounded-md border border-transparent hover:bg-purple-100 hover:border-purple-600 cursor-pointer"
          >
            <Settings className="w-6 h-6 text-gray-800 group-hover:text-purple-600" />
          </button>
          <span className="h-8 w-0.5 mx-2 bg-gray-300"></span>
          <div className="cursor-pointer h-8 w-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-medium text-sm">
            U
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
