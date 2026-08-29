import React from "react";
import { Droplets, AlertTriangle, CheckCircle2 } from "lucide-react";

interface FirearmSummary {
  firearm_id: string;
  name: string;
  rounds_since_cleaning: number;
  last_cleaned_date: string | null;
}

export default function MaintenanceWidget({
  summary,
}: {
  summary: FirearmSummary[];
}) {
  // Sort firearms so the dirtiest (highest rounds_since_cleaning) are at the top
  const sortedSummary = [...summary].sort(
    (a, b) => b.rounds_since_cleaning - a.rounds_since_cleaning
  );

  return (
    <div className="col-span-1 flex h-full min-w-0 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-bold tracking-tight text-gray-900">
            Maintenance Status
          </h3>
        </div>
      </div>

      {/* LIST */}
      <ul className="flex-1 space-y-3 overflow-y-auto">
        {sortedSummary.map((gun) => {
          // Logic for color-coding the status
          const isCritical = gun.rounds_since_cleaning >= 1500;
          const isWarning = gun.rounds_since_cleaning >= 750 && !isCritical;
          const isClean = gun.rounds_since_cleaning < 750;

          return (
            <li
              key={gun.firearm_id}
              className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-3"
            >
              <div className="flex min-w-0 flex-col pr-2">
                <span className="truncate font-semibold text-gray-900">
                  {gun.name}
                </span>
                <span className="text-xs text-gray-500">
                  Last:{" "}
                  {gun.last_cleaned_date
                    ? new Date(gun.last_cleaned_date).toLocaleDateString(
                        "pl-PL",
                        { day: "2-digit", month: "2-digit", year: "numeric" }
                      )
                    : "Never"}
                </span>
              </div>

              {/* STATUS BADGE */}
              <div
                className={`flex w-24 shrink-0 items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
                  isCritical
                    ? "border-red-600 bg-red-50/70 text-red-800"
                    : isWarning
                      ? "border-yellow-600 bg-yellow-50/70 text-yellow-800"
                      : "border-green-600 bg-green-50/70 text-green-800"
                }`}
              >
                {isCritical && <AlertTriangle className="h-3.5 w-3.5" />}
                {isClean && <CheckCircle2 className="h-3.5 w-3.5" />}
                <span>{gun.rounds_since_cleaning} rds</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
