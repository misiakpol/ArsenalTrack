import { supabase } from "@/lib/supabase";
import { Bell } from "lucide-react";
import FirearmListWidget from "@/components/firearms/FirearmsListWidget";

export default async function FirearmsPage() {
  // 1. Fetch data on the server
  const { data: firearms, error } = await supabase.from("firearms").select(`
      *,
      expenses (
        total_cost
      )
    `);

  if (error) {
    return <div className="p-4 text-red-600">Error: {error.message}</div>;
  }

  // 2. Render the layout shell and pass data to the child components
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row gap-2 items-center">
        <Bell className="w-16 h-16"></Bell>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Firearms Management
          </h2>
          <p className="text-sm text-gray-500">
            Manage your arsenal, view values, and track maintenance.
          </p>
        </div>
      </div>

      {/* Grid Layout for Modular Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {/* Pass the fetched data directly into your new widget */}
        <FirearmListWidget firearms={firearms || []} />
      </div>
    </div>
  );
}
