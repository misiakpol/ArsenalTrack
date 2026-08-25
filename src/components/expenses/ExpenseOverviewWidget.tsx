"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Receipt, CreditCard, Calendar, Target, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Timeframe } from "@/app/dashboard/expenses/page";

interface ExpenseOverviewWidgetProps {
  timeframe: Timeframe;
  setTimeframe: (t: Timeframe) => void;
}

export default function ExpenseOverviewWidget({ timeframe, setTimeframe }: ExpenseOverviewWidgetProps) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from Supabase on mount
  useEffect(() => {
    async function fetchExpenses() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("expenses")
        .select("total_cost, expense_date");
        
      if (!error && data) {
        setExpenses(data);
      } else if (error) {
        console.error("Error fetching expenses:", error);
      }
      setIsLoading(false);
    }
    
    fetchExpenses();
    
    window.addEventListener("expenseAdded", fetchExpenses);
    return () => window.removeEventListener("expenseAdded", fetchExpenses);
  }, []);

  // Calculate stats dynamically based on fetched data
  const kpiData = useMemo(() => {
    const now = new Date();
    
    // 1. Filter expenses for the current timeframe
    const currentExpenses = expenses.filter(exp => {
      if (!exp.expense_date) return false;
      const d = new Date(exp.expense_date);
      if (timeframe === "month") {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      } else if (timeframe === "last_month") {
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const lastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
      } else if (timeframe === "year") {
        return d.getFullYear() === now.getFullYear();
      } else {
        return true;
      }
    });

    // 2. Filter expenses for the previous timeframe (for trends)
    const prevExpenses = expenses.filter(exp => {
      if (!exp.expense_date) return false;
      const d = new Date(exp.expense_date);
      if (timeframe === "month") {
        const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
      } else if (timeframe === "last_month") {
        const prevMonth = now.getMonth() <= 1 ? 12 - (2 - now.getMonth()) : now.getMonth() - 2;
        const prevYear = now.getMonth() <= 1 ? now.getFullYear() - 1 : now.getFullYear();
        return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
      } else if (timeframe === "year") {
        return d.getFullYear() === now.getFullYear() - 1;
      } else {
        return false;
      }
    });

    // Helper to calculate totals for a given dataset
    const calcStats = (data: any[]) => {
      const total = data.reduce((sum, item) => sum + (Number(item.total_cost) || 0), 0);
      const transactions = data.length;
      const avgSpent = transactions > 0 ? total / transactions : 0;
      return { total, transactions, avgSpent };
    };

    const currStats = calcStats(currentExpenses);
    const prevStats = calcStats(prevExpenses);

    // Helper to calculate percentage trend
    const getTrend = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? "+100%" : "0%";
      const pct = ((curr - prev) / prev) * 100;
      return (pct > 0 ? "+" : "") + pct.toFixed(1) + "%";
    };

    return {
      total: currStats.total,
      transactions: currStats.transactions,
      avgSpent: currStats.avgSpent,
      totalTrend: timeframe === "all" ? "-" : getTrend(currStats.total, prevStats.total),
      transTrend: timeframe === "all" ? "-" : getTrend(currStats.transactions, prevStats.transactions),
    };
  }, [expenses, timeframe]);

  const budgetThreshold = timeframe === "month" || timeframe === "last_month" ? 500 : timeframe === "year" ? 6000 : 99999;
  const remainingBudget = timeframe === "all" ? null : budgetThreshold - kpiData.total;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-5 h-full col-span-1 md:col-span-2 lg:col-span-3 relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl border border-transparent">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
        </div>
      )}

      {/* HEADER & DROPDOWN */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="font-bold text-lg tracking-tight text-gray-900">
          Expense Overview
        </h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as Timeframe)}
          className="text-sm border border-gray-200 bg-gray-50 text-gray-700 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-purple-600 focus:outline-none cursor-pointer"
        >
          <option value="month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-between gap-4">
        {/* Total Expenses */}
        <div className="grid grid-cols-[30%_70%] lg:justify-start items-center gap-5 border border-gray-200 bg-gray-50/50 rounded-md py-6 px-4">
          <div className="justify-self-end p-4 bg-purple-100 rounded-full shrink-0 border-purple-600 border">
            <Receipt className="h-10 w-10 text-purple-600" />
          </div>
          <div className=" justify-self-start flex flex-col">
            <span className="text-md text-gray-500 font-medium">
              Total Spent
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {kpiData.total.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
              </span>
              <span className={`text-xs font-semibold ${kpiData.totalTrend.startsWith('+') && kpiData.totalTrend !== '+0.0%' ? 'text-red-700' : 'text-green-700'}`}>
                {kpiData.totalTrend}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              vs last {timeframe}
            </span>
          </div>
        </div>

        {/* Transactions */}
        <div className="grid grid-cols-[30%_70%] lg:justify-start items-center gap-5 border border-gray-200 bg-gray-50/50 rounded-md py-6 px-4">
          <div className="justify-self-end p-4 bg-blue-100/50 rounded-full shrink-0 border-blue-600 border">
            <CreditCard className="h-10 w-10 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-md text-gray-500 font-medium">
              Transactions
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {kpiData.transactions}
              </span>
              <span className={`text-xs font-semibold ${kpiData.transTrend.startsWith('+') && kpiData.transTrend !== '+0.0%' ? 'text-red-700' : 'text-green-700'}`}>
                {kpiData.transTrend}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              vs last {timeframe}
            </span>
          </div>
        </div>

        {/* Avg Spent */}
        <div className="grid grid-cols-[30%_70%] lg:justify-start items-center gap-5 border border-gray-200 bg-gray-50/50 rounded-md py-6 px-4">
          <div className="justify-self-end p-4 bg-green-100/50 rounded-full shrink-0 border-green-600 border">
            <Calendar className="h-10 w-10 text-green-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-md text-gray-500 font-medium">
              Avg / {timeframe}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {kpiData.avgSpent.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Per {timeframe}
            </span>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="grid grid-cols-[30%_70%] lg:justify-start items-center gap-5 border border-gray-200 bg-gray-50/50 rounded-md py-6 px-4">
          <div className="justify-self-end p-4 bg-orange-100/50 rounded-full shrink-0 border-orange-600 border">
            <Target className="h-10 w-10 text-orange-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-md text-gray-500 font-medium">
              Remaining Budget
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xl font-bold ${remainingBudget !== null && remainingBudget < 0 ? "text-red-600" : "text-gray-900"}`}
              >
                {timeframe === "all"
                  ? "N/A"
                  : `${remainingBudget?.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {timeframe === "all" ? "No limit for All Time" : `Of ${budgetThreshold.toLocaleString("pl-PL")} zł limit`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
