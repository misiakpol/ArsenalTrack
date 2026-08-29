import { supabase } from "@/lib/supabase";
import FirearmListWidget from "@/components/firearms/FirearmsListWidget";
import MaintenanceWidget from "@/components/firearms/MaintenanceWidget";
import GunIcon from "@/components/icons/GunIcon";
import ArsenalUsageWidget from "@/components/firearms/ArsenalUsageChart";
import AddFirearmModal from "@/components/firearms/AddFirearmModal";

export default async function FirearmsPage() {
  // 1. Fetch data on the server
  const { data: firearms, error: firearmsError } = await supabase
    .from("firearms")
    .select(`*, expenses (total_cost)`);

  const { data: summary, error: summaryError } = await supabase
    .from("v_firearm_summary")
    .select("*");

  if (firearmsError || summaryError) {
    return <div className="p-4 text-red-600">Error loading data.</div>;
  }

  // 2. Render the layout shell and pass data to the child components
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:justify-between sm:gap-6 sm:px-3">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <GunIcon className="h-10 w-10 text-purple-500" />
          <div className="mb-3 flex flex-col items-center gap-1 sm:mb-0 sm:items-baseline">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Firearms Management
            </h2>
            <p className="text-center text-sm text-gray-500 sm:text-left">
              Manage your arsenal, view values, and track maintenance.
            </p>
          </div>
        </div>
        <AddFirearmModal />
      </div>

      {/* Grid Layout for Modular Components */}
      <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {/* Pass the fetched data directly into your new widget */}
        <FirearmListWidget firearms={firearms || []} />
        <MaintenanceWidget summary={summary || []} />
        <ArsenalUsageWidget />
      </div>
    </div>
  );
}
