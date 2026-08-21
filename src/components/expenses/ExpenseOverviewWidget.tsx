"use client";
import React, { useState } from "react";
import { Receipt, CreditCard, Calendar, Target } from "lucide-react";

export default function ExpenseOverviewWidget() {
  const [timeframe, setTimeframe] = useState<"month" | "year">("month");

  // Frontend Budget Thresholds & Dummy Data
  const budgetThreshold = timeframe === "month" ? 2000 : 24000;

  const kpiData = {
    month: {
      total: 1250,
      transactions: 8,
      avgSpent: 410,
      totalTrend: "+30.2%",
      transTrend: "-2.1%",
    },
    year: {
      total: 14500,
      transactions: 94,
      avgSpent: 390,
      totalTrend: "+15.4%",
      transTrend: "+8.3%",
    },
  };

  const current = kpiData[timeframe];
  const remainingBudget = budgetThreshold - current.total;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-5 h-full col-span-3">
      {/* HEADER & DROPDOWN */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="font-bold text-lg tracking-tight text-gray-900">
          Expense Overview
        </h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as "month" | "year")}
          className="text-sm border border-gray-200 bg-gray-50 text-gray-700 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-purple-600 focus:outline-none cursor-pointer"
        >
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between gap-4">
        {/* Total Expenses */}

        <div className="grid grid-cols-[40%_60%] lg:justify-start items-center gap-3 border border-gray-200 bg-gray-50/50 rounded-md py-6 px-4">
          <div className="justify-self-end p-4 bg-purple-100 rounded-full shrink-0 border-purple-600 border">
            <Receipt className="h-10 w-10 text-purple-600" />
          </div>
          <div className=" justify-self-start flex flex-col">
            <span className="text-md text-gray-500 font-medium">
              Total Spent
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {current.total.toLocaleString("pl-PL")} zł
              </span>
              <span className="text-xs font-semibold text-red-700">
                {current.totalTrend}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              vs last {timeframe}
            </span>
          </div>
        </div>

        {/* Transactions */}
        <div className="grid grid-cols-[40%_60%] lg:justify-start items-center gap-3 border border-gray-200 bg-gray-50/50 rounded-md py-6 px-4">
          <div className="justify-self-end p-4 bg-blue-100/50 rounded-full shrink-0 border-blue-600 border">
            <CreditCard className="h-10 w-10 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-md text-gray-500 font-medium">
              Transactions
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {current.transactions}
              </span>
              <span className="text-xs font-semibold text-green-700">
                {current.transTrend}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              vs last {timeframe}
            </span>
          </div>
        </div>

        {/* Avg Spent */}
        <div className="grid grid-cols-[40%_60%] lg:justify-start items-center gap-3 border border-gray-200 bg-gray-50/50 rounded-md py-6 px-4">
          <div className="justify-self-end p-4 bg-green-100/50 rounded-full shrink-0 border-green-600 border">
            <Calendar className="h-10 w-10 text-green-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-md text-gray-500 font-medium">
              Avg / {timeframe}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {current.avgSpent.toLocaleString("pl-PL")} zł
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Per {timeframe}
            </span>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="grid grid-cols-[40%_60%] lg:justify-start items-center gap-3 border border-gray-200 bg-gray-50/50 rounded-md py-6 px-4">
          <div className="justify-self-end p-4 bg-orange-100/50 rounded-full shrink-0 border-orange-600 border">
            <Target className="h-10 w-10 text-orange-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-md text-gray-500 font-medium">
              Remaining Budget
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xl font-bold ${remainingBudget < 0 ? "text-red-600" : "text-gray-900"}`}
              >
                {remainingBudget.toLocaleString("pl-PL")} zł
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Of {budgetThreshold.toLocaleString("pl-PL")} zł limit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
