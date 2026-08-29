"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Activity } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TrendData {
  period_date: string;
  period_rounds: number;
  cumulative_rounds: number;
  displayDate: string;
}

export default function ArsenalTrendWidget() {
  // UI State Management
  const [metric, setMetric] = useState<"ammo" | "cumulative">("ammo");
  const [grain, setGrain] = useState<"week" | "month" | "year">("week");

  const [chartData, setChartData] = useState<TrendData[]>([]);

  useEffect(() => {
    async function fetchTrendData() {
      // Pass the selected grain (week/month/year) to the Supabase RPC
      const { data, error } = await supabase.rpc(
        "get_time_grouped_ammo_trend",
        {
          time_grain: grain,
        }
      );

      if (!error && data) {
        const formattedData = data.map((item: any) => {
          const date = new Date(item.period_date);

          // Format X-axis differently depending on the timeframe
          let display = "";
          if (grain === "week") {
            // Calculate the week number
            const start = new Date(date.getFullYear(), 0, 1);
            const days = Math.floor(
              (date.getTime() - start.getTime()) / 86400000
            );
            const weekNumber = Math.ceil((days + start.getDay() + 1) / 7);

            // Get the short month name (e.g., "May", "Jun")
            const monthStr = date.toLocaleDateString("en-US", {
              month: "short",
            });

            // Combine them into "mmm.ww"
            display = `${monthStr}.${weekNumber}`;
          }
          if (grain === "month")
            display = date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
          if (grain === "year")
            display = date.toLocaleDateString("en-US", { year: "numeric" });

          return {
            ...item,
            displayDate: display,
          };
        });
        setChartData(formattedData);
      }
    }

    fetchTrendData();
  }, [grain]); // Re-fetch the data from PostgreSQL every time the dropdown changes

  const showLabels = chartData.length <= 12;

  return (
    <div className="col-span-1 flex h-full min-h-100 flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm sm:col-span-2 sm:p-5">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-bold tracking-tight text-gray-900">
            Ammunition Trend
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 1. THE METRIC SWITCH (Ammunition vs Cumulative) */}
          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
            <button
              onClick={() => setMetric("ammo")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                metric === "ammo"
                  ? "border border-gray-200 bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Ammunition
            </button>
            <button
              onClick={() => setMetric("cumulative")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                metric === "cumulative"
                  ? "border border-gray-200 bg-white text-purple-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Cumulative
            </button>
          </div>

          {/* 2. THE TIMEFRAME DROPDOWN */}
          <select
            value={grain}
            onChange={(e) => setGrain(e.target.value as any)}
            className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 focus:ring-1 focus:ring-purple-600 focus:outline-none"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
      </div>

      {/* RECHARTS VISUALIZATION */}
      <div className="mt-2 h-full min-h-75 w-full flex-1 text-sm">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400 italic">
            Loading trend data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 25, right: 20, left: -20, bottom: 0 }}
            >
              <defs>
                {/* The Purple Cumulative Gradient */}
                <linearGradient
                  id="colorCumulative"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-purple-500)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-purple-500)"
                    stopOpacity={0}
                  />
                </linearGradient>

                {/* The Blue Ammunition Gradient */}
                <linearGradient id="colorAmmo" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-blue-500)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-blue-500)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="0"
                vertical={false}
                stroke="var(--color-gray-200)"
                strokeOpacity={0.3}
              />

              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--color-gray-200)",
                  backgroundColor: "var(--color-white)",
                  color: "var(--color-gray-900)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />

              {/* Dynamically render the Area based on the selected metric switch */}
              {metric === "cumulative" ? (
                <Area
                  type="monotone"
                  dataKey="cumulative_rounds"
                  animationDuration={500}
                  name="Cumulative"
                  stroke="#9810fa"
                  strokeWidth={2}
                  fill="url(#colorCumulative)"
                  label={
                    showLabels
                      ? {
                          position: "top",
                          fill: "#a855f7",
                          fontSize: 12,
                          fontWeight: 600,
                        }
                      : false // <-- Turns off label when crowded
                  }
                />
              ) : (
                <Area
                  type="monotone"
                  dataKey="period_rounds"
                  animationDuration={500}
                  name="Ammunition"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorAmmo)"
                  label={
                    showLabels
                      ? {
                          position: "top",
                          fill: "#3b82f6",
                          fontSize: 12,
                          fontWeight: 600,
                        }
                      : false // <-- Turns off label when crowded
                  }
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
