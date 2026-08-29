"use client";

import React, { useState, useEffect } from "react";
import { Crosshair, Plus } from "lucide-react";
import AddSessionModal from "@/components/sessions/AddSessionModal";
import SessionsTable from "@/components/sessions/SessionsTable";
import TrainingLogsTable from "@/components/sessions/TrainingLogsTable";
import { ShootingLog, TrainingLog } from "@/types";
import { supabase } from "@/lib/supabaseClient";

const Sessions = () => {
  const [shootingLogs, setShootingLogs] = useState<ShootingLog[]>([]);
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      
      const { data: sLogs, error: sError } = await supabase
        .from('shooting_logs')
        .select(`
          *,
          firearms ( name )
        `)
        .order('session_date', { ascending: false })
        .limit(10);
        
      if (!sError && sLogs) {
        setShootingLogs(sLogs);
      } else {
        console.error("Error fetching shooting logs:", sError);
      }

      const { data: tLogs, error: tError } = await supabase
        .from('training_logs')
        .select(`
          *,
          firearms ( name )
        `)
        .order('session_date', { ascending: false })
        .limit(10);
        
      if (!tError && tLogs) {
        setTrainingLogs(tLogs);
      } else {
        console.error("Error fetching training logs:", tError);
      }

      setIsLoading(false);
    };

    fetchLogs();
  }, []);

  const handleAddSession = (newLog: ShootingLog, newTrainingLogs?: TrainingLog[]) => {
    setShootingLogs((prev) => [newLog, ...prev].slice(0, 10));
    if (newTrainingLogs && newTrainingLogs.length > 0) {
      setTrainingLogs((prev) => [...newTrainingLogs, ...prev].slice(0, 10));
    }
  };

  const handleDeleteShootingLog = async (id: string) => {
    setShootingLogs((prev) => prev.filter(log => log.id !== id));
    await supabase.from('shooting_logs').delete().eq('id', id);
  };

  const handleDeleteTrainingLog = async (id: string) => {
    setTrainingLogs((prev) => prev.filter(log => log.id !== id));
    await supabase.from('training_logs').delete().eq('id', id);
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

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading logs...</div>
        ) : (
          <>
            <SessionsTable logs={shootingLogs} onDelete={handleDeleteShootingLog} />
            <TrainingLogsTable logs={trainingLogs} onDelete={handleDeleteTrainingLog} />
          </>
        )}
        
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
