"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Crosshair,
  Receipt,
  Settings,
  ChevronLeft,
  ChevronRight,
  BowArrow,
} from "lucide-react";
import GunIcon from "../icons/GunIcon";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Range Sessions", href: "/dashboard/sessions", icon: Crosshair },
  { name: "Expenses", href: "/dashboard/expenses", icon: Receipt },
  { name: "Firearms", href: "/dashboard/firearms", icon: GunIcon },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) {
  const pathname = usePathname();

  // Sidebar State Management
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem("sidebarExpanded");
    if (savedState !== null) {
      setIsExpanded(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem("sidebarExpanded", JSON.stringify(newState));
  };

  const handleLinkClick = () => {
    // 1. Close the mobile drawer if it's open
    if (isOpen) {
      setIsOpen(false);
    }
    // 2. Collapse the desktop overlay if it's expanded
    if (isExpanded) {
      setIsExpanded(false);
      localStorage.setItem("sidebarExpanded", JSON.stringify(false));
    }
  };

  if (!mounted) {
    return (
      <>
        {/* The Phantom Spacer */}
        <div className="hidden h-full w-16 shrink-0 md:block"></div>
        {/* The Fixed Sidebar Shell */}
        <aside className="fixed top-0 left-0 z-50 hidden h-full w-16 flex-col border-r border-gray-200 bg-white md:flex"></aside>
      </>
    );
  }
  return (
    <>
      <div className="hidden h-full w-16 shrink-0 md:block"></div>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-gray-200 bg-white px-2 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isExpanded ? "w-64 shadow-xl" : "w-64 md:w-16"}`}
      >
        {/* Brand / Logo */}
        <div className="mb-4 flex h-16 items-center justify-center gap-2 py-4">
          <button
            onClick={toggleSidebar}
            className="hidden rounded-md p-1 text-gray-500 hover:bg-purple-50 hover:text-purple-600 md:block"
          >
            {isExpanded ? (
              <ChevronLeft size={24} />
            ) : (
              <ChevronRight size={24} />
            )}
          </button>
          <span
            className={`flex items-center text-lg leading-none font-semibold text-gray-800 uppercase ${isExpanded ? "" : "md:hidden"}`}
          >
            Arsenal<span className="font-bold text-purple-600">Track</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-500"
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${
                    isActive
                      ? "text-purple-700"
                      : "text-gray-500 group-hover:text-gray-500"
                  }`}
                />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                    isExpanded
                      ? "ml-3 w-auto opacity-100"
                      : "ml-3 w-auto opacity-100 md:hidden md:w-0 md:opacity-0"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
