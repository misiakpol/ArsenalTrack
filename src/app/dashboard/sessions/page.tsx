"use client";

import React, { useState } from "react";
import { Crosshair, Plus } from "lucide-react";
import AddSessionModal from "@/components/sessions/AddSessionModal";
import SessionsTable from "@/components/sessions/SessionsTable";
import { ShootingLog } from "@/types";

// Initial mock data
const initialLogs: ShootingLog[] = [
  {
    id: "1",
    firearm_id: "Glock 19", // mocking as string name for display
    session_date: "2026-08-28",
    rounds_fired: 150,
    created_at: "2026-08-28T10:00:00Z",
  },
  {
    id: "2",
    firearm_id: "AR-15",
    session_date: "2026-08-20",
    rounds_fired: 300,
    created_at: "2026-08-20T14:30:00Z",
  },
];

const Sessions = () => {
  const [logs, setLogs] = useState<ShootingLog[]>(initialLogs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddSession = (newLog: ShootingLog, trainingLogs?: any[]) => {
    setLogs([...logs, newLog]);
    if (trainingLogs && trainingLogs.length > 0) {
      console.log("Mock Training Logs created:", trainingLogs);
    }
  };

  const handleDelete = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:justify-between sm:gap-6 sm:px-3">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Crosshair className="h-10 w-10 text-purple-500" />
            <div className="mb-3 flex flex-col items-center gap-1 sm:mb-0 sm:items-baseline">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Range Sessions
              </h2>
              <p className="text-center text-sm text-gray-500 sm:text-left">
                Track your range sessions and progress.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            Add Session
          </button>
        </div>

        <SessionsTable logs={logs} onDelete={handleDelete} />
        
        <AddSessionModal 
          isOpen={isDialogOpen} 
          setIsOpen={setIsDialogOpen} 
          onAdd={handleAddSession} 
        />
      </div>
    </div>
  );
};

export default Sessions;
