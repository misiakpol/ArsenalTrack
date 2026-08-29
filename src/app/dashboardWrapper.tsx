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
    <div className="light flex h-screen w-full overflow-hidden bg-gray-50 text-gray-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. CHANGED: Added flex, h-full, and overflow-y-auto. Removed h-max. */}
      <main className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto bg-gray-50">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="mx-4 my-5">{children}</div>
      </main>
    </div>
  );
}
