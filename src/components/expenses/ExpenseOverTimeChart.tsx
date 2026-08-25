"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/lib/supabase";
import { Loader2, TrendingUp } from "lucide-react";
import { Timeframe } from "@/app/dashboard/expenses/page";

interface ExpenseOverTimeChartProps {
  timeframe: Timeframe;
}

export default function ExpenseOverTimeChart({ timeframe }: ExpenseOverTimeChartProps) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data } = await supabase.from("expenses").select("total_cost, expense_date");
      if (data) setExpenses(data);
      setIsLoading(false);
    }
    fetchData();
    window.addEventListener("expenseAdded", fetchData);
    return () => window.removeEventListener("expenseAdded", fetchData);
  }, []);

  const chartData = useMemo(() => {
    const now = new Date();
    
    // Filter expenses
    const filteredExpenses = expenses.filter(exp => {
      if (timeframe === "all") return true;
      if (!exp.expense_date) return false;
      const d = new Date(exp.expense_date);
      if (timeframe === "month") {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      } else if (timeframe === "last_month") {
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const lastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
      } else {
        return d.getFullYear() === now.getFullYear();
      }
    });

    if (timeframe === "month" || timeframe === "last_month") {
      // Group by day
      const daysInMonth = new Date(
        timeframe === "month" ? now.getFullYear() : (now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()),
        timeframe === "month" ? now.getMonth() + 1 : (now.getMonth() === 0 ? 12 : now.getMonth()),
        0
      ).getDate();

      const dailyTotals = Array.from({ length: daysInMonth }, (_, i) => ({
        name: `${i + 1}`,
        value: 0
      }));

      filteredExpenses.forEach(exp => {
        const d = new Date(exp.expense_date);
        const day = d.getDate();
        if (day >= 1 && day <= daysInMonth) {
          dailyTotals[day - 1].value += Number(exp.total_cost) || 0;
        }
      });
      return dailyTotals;
    } else {
      // Group by month
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyTotals = monthNames.map(name => ({ name, value: 0 }));
      
      filteredExpenses.forEach(exp => {
        const d = new Date(exp.expense_date);
        const month = d.getMonth();
        monthlyTotals[month].value += Number(exp.total_cost) || 0;
      });

      if (timeframe === "year") {
        return monthlyTotals.filter((_, i) => i <= now.getMonth());
      }
      
      return monthlyTotals;
    }
  }, [expenses, timeframe]);

  // Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-md">
          <p className="font-semibold text-gray-800">{timeframe === "month" || timeframe === "last_month" ? `Day ${label}` : label}</p>
          <p className="text-purple-600 font-bold">
            {payload[0].value.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-5 relative h-full min-h-100 col-span-1 md:col-span-2 lg:col-span-3">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl border border-transparent">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          <h3 className="font-bold text-lg tracking-tight text-gray-900">
            Expenses Over Time
          </h3>
        </div>
      </div>

      {/* CHART CONTENT */}
      {chartData.length > 0 ? (
        <div className="flex-1 w-full relative min-h-62.5 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f3f4f620" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                dy={10}
                minTickGap={20}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `${value} zł`}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#9333ea" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3 min-h-62.5">
          <div className="p-4 bg-gray-50 rounded-full">
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium">No expenses found for this timeframe.</p>
        </div>
      )}
    </div>
  );
}
