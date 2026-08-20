"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // 1. CHANGED: min-h-screen to h-screen and added overflow-hidden
    <div className="light flex bg-gray-50 text-gray-900 w-full h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. CHANGED: Added flex, h-full, and overflow-y-auto. Removed h-max. */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-gray-50">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="my-5 mx-4">{children}</div>
      </main>
    </div>
  );
}
