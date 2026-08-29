import React from "react";
import Image from "next/image";
import { Layers, Receipt } from "lucide-react";
import FirearmActions from "./FirearmsActions";

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
      0
    );
    return total + gunTotal;
  }, 0);

  return (
    <div className="col-span-1 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm md:col-span-3 xl:row-span-2 2xl:col-span-2">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-4">
          <Layers className="hidden h-10 w-10 text-purple-500 md:block" />
          <div className="flex flex-col">
            <h3 className="text-lg font-bold tracking-tight text-gray-900">
              Arsenal Overview
            </h3>
            <span className="text-sm font-medium text-purple-500">
              {firearms.length} Firearms
            </span>
          </div>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
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
            0
          );

          return (
            <li
              key={gun.id}
              className="group relative flex min-w-2xs flex-col items-center gap-2 rounded-md border border-transparent transition-colors hover:border-gray-100 hover:bg-gray-50"
            >
              {/* IMAGE DIV */}
              <div className="relative flex h-44 w-full shrink-0 items-center justify-center overflow-hidden">
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
                  <span className="text-xs font-medium text-gray-400">IMG</span>
                )}
              </div>
              {/* DETAILS DIV */}
              <div className="flex min-w-0 grow flex-col items-center justify-center">
                <span className="truncate text-xl leading-tight font-bold text-gray-900">
                  {gun.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
                  <span>{gun.type}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                  <span>{gun.platform}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                  <span className="font-medium">{gun.caliber}</span>
                </span>
              </div>

              {/* COST DIV */}
              <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50 px-2.5 py-1.5 group-hover:bg-gray-100">
                <Receipt className="h-5 w-5 text-purple-600" />
                <span className="text-md font-semibold text-gray-800">
                  {gunCost.toLocaleString("pl-PL")} zł
                </span>
              </div>
              <div className="flex items-center gap-4 p-3"></div>

              {/* MODIFICATION ICON */}
              <div className="absolute top-3 right-3">
                <FirearmActions firearm={gun} />
              </div>
            </li>
          );
        })}

        {firearms.length === 0 && (
          <div className="py-4 text-center text-sm text-gray-500 italic">
            No firearms found in the armory.
          </div>
        )}
      </ul>
    </div>
  );
}
