import React from "react";
import Image from "next/image";
import { Receipt } from "lucide-react";

// 1. Update the interface to include image_url and the nested expenses array
interface Firearm {
  id: string;
  name: string;
  type: string;
  platform: string;
  caliber: string;
  image_url: string | null;
  expenses: { total_cost: number }[];
}

export default function FirearmListWidget({
  firearms,
}: {
  firearms: Firearm[];
}) {
  // 2. Calculate the grand total cost of all firearms combined
  const grandTotal = firearms.reduce((total, gun) => {
    const gunTotal = gun.expenses.reduce(
      (sum, exp) => sum + Number(exp.total_cost),
      0,
    );
    return total + gunTotal;
  }, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col gap-4 col-span-3 2xl:col-span-2">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex flex-col">
          <h3 className="font-bold text-lg tracking-tight text-gray-900">
            Arsenal Overview
          </h3>
          <span className="text-sm font-medium text-purple-600">
            {firearms.length} Firearms
          </span>
        </div>
        <div className="text-right flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Total Value
          </span>
          <span className="font-bold text-gray-900">
            {grandTotal.toLocaleString("pl-PL")} zł
          </span>
        </div>
      </div>

      {/* LIST */}
      <ul className="flex flex-wrap justify-center gap-4">
        {firearms.map((gun, index) => {
          // Calculate individual firearm cost
          const gunCost = gun.expenses.reduce(
            (sum, exp) => sum + Number(exp.total_cost),
            0,
          );

          return (
            <li
              key={gun.id}
              className="group flex flex-col min-w-2xs items-center gap-2 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-100"
            >
              {/* IMAGE DIV */}
              <div className="relative h-44 w-full shrink-0 flex items-center justify-center overflow-hidden">
                {gun.image_url ? (
                  <Image
                    src={gun.image_url}
                    alt={gun.name}
                    fill
                    className="object-contain p-1"
                    sizes="600px"
                    priority={index < 4}
                  />
                ) : (
                  <span className="text-xs text-gray-400 font-medium">IMG</span>
                )}
              </div>
              {/* DETAILS DIV */}
              <div className="flex flex-col grow min-w-0 justify-center items-center">
                <span className="text-xl font-bold text-gray-900 truncate leading-tight">
                  {gun.name}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                  <span>{gun.type}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{gun.platform}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="font-medium">{gun.caliber}</span>
                </span>
              </div>

              {/* COST DIV */}
              <div className="flex items-center gap-1.5 shrink-0 bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-100 group-hover:bg-gray-100">
                <Receipt className="h-5 w-5 text-purple-600" />
                <span className="text-md font-semibold text-gray-800">
                  {gunCost.toLocaleString("pl-PL")} zł
                </span>
              </div>
              <div className="flex items-center gap-4 p-3"></div>
            </li>
          );
        })}

        {firearms.length === 0 && (
          <div className="text-sm text-gray-500 italic py-4 text-center">
            No firearms found in the armory.
          </div>
        )}
      </ul>
    </div>
  );
}
