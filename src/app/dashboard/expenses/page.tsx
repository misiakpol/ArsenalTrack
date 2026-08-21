"use client";

import React from "react";
import { Wallet, Plus } from "lucide-react";
import ExpenseOverviewWidget from "@/components/expenses/ExpenseOverviewWidget";

export default function ExpensesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Wallet className="w-10 h-10 text-purple-600" />
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Financial Overview
            </h2>
            <p className="text-sm text-gray-500">
              Track your arsenal investments and budget.
            </p>
          </div>
        </div>

        {/* DUMMY ADD BUTTON */}
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </div>

      {/* MODULAR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
        <ExpenseOverviewWidget />
      </div>
    </div>
  );
}
