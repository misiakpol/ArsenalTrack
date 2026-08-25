"use client";

import React, { useState } from "react";
import { Wallet, Plus } from "lucide-react";
import ExpenseOverviewWidget from "@/components/expenses/ExpenseOverviewWidget";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";
import ExpenseCategoriesPieChart from "@/components/expenses/ExpenseCategoriesPieChart";
import ExpenseOverTimeChart from "@/components/expenses/ExpenseOverTimeChart";
import RecentTransactionsTable from "@/components/expenses/RecentTransactionsTable";

export type Timeframe = "month" | "last_month" | "year" | "all";

export default function ExpensesPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Wallet className="w-10 h-10 text-purple-500" />
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center sm:text-start">
              Financial Overview
            </h2>
            <p className="text-sm text-gray-500 text-center sm:text-start">
              Track your arsenal investments and budget.
            </p>
          </div>
        </div>

        {/* ADD EXPENSE BUTTON */}
        <AddExpenseModal />
      </div>

      {/* MODULAR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
        <ExpenseOverviewWidget timeframe={timeframe} setTimeframe={setTimeframe} />
        <ExpenseCategoriesPieChart timeframe={timeframe} />
        <ExpenseOverTimeChart timeframe={timeframe} />
        <RecentTransactionsTable />
      </div>
    </div>
  );
}
