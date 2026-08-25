"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/lib/supabase";
import { Loader2, PieChart as PieChartIcon } from "lucide-react";
import { Timeframe } from "@/app/dashboard/expenses/page";

const COLORS = [
  '#9333ea', // purple-600
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#ec4899'  // pink-500
];

interface ExpenseCategoriesPieChartProps {
  timeframe: Timeframe;
}

export default function ExpenseCategoriesPieChart({ timeframe }: ExpenseCategoriesPieChartProps) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [expRes, catRes] = await Promise.all([
        supabase.from("expenses").select("category_id, total_cost, expense_date"),
        supabase.from("expense_categories").select("id, name")
      ]);

      if (expRes.data) setExpenses(expRes.data);
      if (catRes.data) setCategories(catRes.data);
      
      setIsLoading(false);
    }
    
    fetchData();
    window.addEventListener("expenseAdded", fetchData);
    return () => window.removeEventListener("expenseAdded", fetchData);
  }, []);

  const chartData = useMemo(() => {
    const now = new Date();
    
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

    const categoryTotals: Record<string, number> = {};
    
    filteredExpenses.forEach(exp => {
      const catId = exp.category_id;
      if (!catId) return;
      categoryTotals[catId] = (categoryTotals[catId] || 0) + (Number(exp.total_cost) || 0);
    });

    const data = Object.entries(categoryTotals).map(([catId, total]) => {
      const category = categories.find(c => c.id === catId);
      return {
        name: category ? category.name : "Unknown",
        value: total
      };
    }).filter(item => item.value > 0);

    // Sort by value descending
    return data.sort((a, b) => b.value - a.value);
  }, [expenses, categories, timeframe]);

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-md">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-purple-600 font-bold">
            {payload[0].value.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-5 relative h-full min-h-100 col-span-1 md:col-span-2">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl border border-transparent">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-purple-600" />
          <h3 className="font-bold text-lg tracking-tight text-gray-900">
            Expenses by Category
          </h3>
        </div>
      </div>

      {/* CHART CONTENT */}
      {chartData.length > 0 ? (
        <div className="flex-1 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8 w-full mt-2">
          {/* Pie Chart */}
          <div className="relative w-full md:w-1/2 min-h-70 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Table */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <ul className="flex flex-col gap-3">
              {chartData.map((entry, index) => {
                const percentage = totalValue > 0 ? Math.round((entry.value / totalValue) * 100) : 0;
                return (
                  <li key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-gray-600 font-medium">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">
                        {entry.value.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł
                      </span>
                      <span className="text-gray-500 text-right min-w-[32px]">{percentage}%</span>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Total Row */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
              <span className="font-bold text-gray-900">Total</span>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900">
                  {totalValue.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł
                </span>
                <span className="min-w-[32px]"></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3 min-h-70">
          <div className="p-4 bg-gray-50 rounded-full">
            <PieChartIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium">No expenses found for this timeframe.</p>
        </div>
      )}
    </div>
  );
}
