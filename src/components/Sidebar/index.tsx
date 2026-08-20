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

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Range Sessions", href: "/dashboard/sessions", icon: Crosshair },
  { name: "Expenses", href: "/dashboard/expenses", icon: Receipt },
  { name: "Firearms", href: "/dashboard/firearms", icon: BowArrow },
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
        <div className="hidden md:block w-16 shrink-0 h-full"></div>
        {/* The Fixed Sidebar Shell */}
        <aside className="hidden md:flex flex-col fixed top-0 left-0 z-50 w-16 bg-white border-r border-gray-200 h-full"></aside>
      </>
    );
  }
  return (
    <>
      <div className="hidden md:block w-16 shrink-0 h-full"></div>
      <aside
        className={`fixed inset-y-0 left-0 z-50 px-2 flex flex-col bg-white border-r border-gray-200 h-full transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isExpanded ? "w-64 shadow-xl" : "w-64 md:w-16"}`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-center h-16 gap-2 py-4 mb-4">
          <button
            onClick={toggleSidebar}
            className="hidden md:block p-1 rounded-md text-gray-500 hover:bg-purple-50 hover:text-purple-600"
          >
            {isExpanded ? (
              <ChevronLeft size={24} />
            ) : (
              <ChevronRight size={24} />
            )}
          </button>
          <span
            className={`flex items-center leading-none text-lg uppercase font-semibold text-gray-800 ${isExpanded ? "" : "md:hidden"}`}
          >
            Arsenal<span className="text-purple-600 font-bold">Track</span>
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
                className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:text-gray-500 hover:bg-gray-100"
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
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? "w-auto opacity-100 ml-3"
                      : "w-auto opacity-100 ml-3 md:hidden md:w-0 md:opacity-0"
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
