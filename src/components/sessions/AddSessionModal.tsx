"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Target, PlusCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ShootingLog } from "@/types";

type TrainingLogEntry = {
  id: string;
  shooterName: string;
  distanceM: string;
  drillType: string;
  score: string;
  maxScore: string;
};

interface AddSessionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAdd: (log: ShootingLog, trainingLogs?: any[]) => void;
}

export default function AddSessionModal({ isOpen, setIsOpen, onAdd }: AddSessionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [firearms, setFirearms] = useState<{ id: string; name: string }[]>([]);
  const [uniqueShooters, setUniqueShooters] = useState<string[]>([]);
  const [uniqueDrillTypes, setUniqueDrillTypes] = useState<string[]>([]);
  
  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      // Fetch firearms
      const { data: firearmsData } = await supabase.from("firearms").select("id, name");
      if (firearmsData) setFirearms(firearmsData);
      
      // Fetch unique shooters and drill types from training_logs
      const { data: logsData } = await supabase.from("training_logs").select("shooter_name, drill_type");
      if (logsData) {
        const uniqueNames = new Set<string>();
        const uniqueDrills = new Set<string>();
        logsData.forEach((row) => {
          if (row.shooter_name) uniqueNames.add(row.shooter_name);
          if (row.drill_type) uniqueDrills.add(row.drill_type);
        });
        setUniqueShooters(Array.from(uniqueNames));
        setUniqueDrillTypes(Array.from(uniqueDrills));
      }
    }
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Prevent Background Scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Form state
  const [firearmId, setFirearmId] = useState("");
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [roundsFired, setRoundsFired] = useState("");

  const [createTrainingLog, setCreateTrainingLog] = useState(false);
  
  // Array of training log entries
  const [trainingLogs, setTrainingLogs] = useState<TrainingLogEntry[]>([]);

  const handleAddTrainingLog = () => {
    setTrainingLogs([
      ...trainingLogs, 
      { id: Math.random().toString(36).substring(2, 9), shooterName: "", distanceM: "25", drillType: "", score: "", maxScore: "50" }
    ]);
  };

  const handleRemoveTrainingLog = (id: string) => {
    setTrainingLogs(trainingLogs.filter(log => log.id !== id));
  };

  const updateTrainingLog = (id: string, field: keyof TrainingLogEntry, value: string) => {
    setTrainingLogs(trainingLogs.map(log => 
      log.id === id ? { ...log, [field]: value } : log
    ));
  };

  // When toggling the checkbox, ensure there's at least one entry
  useEffect(() => {
    if (createTrainingLog && trainingLogs.length === 0) {
      handleAddTrainingLog();
    }
  }, [createTrainingLog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firearmId || !sessionDate || !roundsFired) return;
    setIsSubmitting(true);

    // Mocking async submission
    setTimeout(() => {
      const firearmName = firearms.find(f => f.id === firearmId)?.name || firearmId;
      
      const newLog: ShootingLog = {
        id: Math.random().toString(36).substring(2, 9),
        firearm_id: firearmName, // Mocking display name for now
        session_date: sessionDate,
        rounds_fired: parseInt(roundsFired),
        created_at: new Date().toISOString(),
      };

      let tLogsToCreate = undefined;
      if (createTrainingLog) {
        tLogsToCreate = trainingLogs.map(log => ({
          firearm_id: firearmId,
          session_date: sessionDate,
          shooter_name: log.shooterName,
          distance_m: parseInt(log.distanceM),
          drill_type: log.drillType,
          score: parseFloat(log.score),
          max_score: parseFloat(log.maxScore),
        }));
      }
      
      onAdd(newLog, tLogsToCreate);
      
      setIsSubmitting(false);
      setIsOpen(false);
      
      // Reset form
      setFirearmId("");
      setSessionDate(new Date().toISOString().split("T")[0]);
      setRoundsFired("");
      setCreateTrainingLog(false);
      setTrainingLogs([]);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Add Range Session
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 transition-colors hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Firearm
            </label>
            <select
              required
              value={firearmId}
              onChange={(e) => setFirearmId(e.target.value)}
              className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none ${firearmId === "" ? "text-gray-500" : "text-gray-900"}`}
            >
              <option value="" disabled>Select a firearm...</option>
              {firearms.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Date
            </label>
            <input
              required
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Rounds Fired
            </label>
            <input
              required
              type="number"
              min="1"
              placeholder="e.g. 150"
              value={roundsFired}
              onChange={(e) => setRoundsFired(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="createTrainingLog"
              checked={createTrainingLog}
              onChange={(e) => setCreateTrainingLog(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label
              htmlFor="createTrainingLog"
              className="text-sm font-semibold text-gray-700"
            >
              Also create Training Logs
            </label>
          </div>

          {createTrainingLog && (
            <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
              {trainingLogs.map((log, index) => (
                <div key={log.id} className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-800">Shooter {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveTrainingLog(log.id)}
                      className="text-red-500 transition-colors hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-700">Shooter Name</label>
                      <input
                        required
                        type="text"
                        list="shooters-list"
                        placeholder="Select or type name"
                        value={log.shooterName}
                        onChange={(e) => updateTrainingLog(log.id, "shooterName", e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex w-1/2 flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Distance (m)</label>
                        <input
                          type="number"
                          placeholder="25"
                          value={log.distanceM}
                          onChange={(e) => updateTrainingLog(log.id, "distanceM", e.target.value)}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex w-1/2 flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Drill Type</label>
                        <select
                          required
                          value={log.drillType}
                          onChange={(e) => updateTrainingLog(log.id, "drillType", e.target.value)}
                          className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none ${log.drillType === "" ? "text-gray-500" : "text-gray-900"}`}
                        >
                          <option value="" disabled>Select a drill...</option>
                          {uniqueDrillTypes.map((drill, i) => (
                            <option key={i} value={drill}>{drill}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex w-1/2 flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Score</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="45"
                          value={log.score}
                          onChange={(e) => updateTrainingLog(log.id, "score", e.target.value)}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex w-1/2 flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Max Score</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="50"
                          value={log.maxScore}
                          onChange={(e) => updateTrainingLog(log.id, "maxScore", e.target.value)}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddTrainingLog}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-purple-300 bg-purple-50 py-2 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100 hover:text-purple-800"
              >
                <PlusCircle className="h-4 w-4" />
                Add Another Shooter
              </button>
            </div>
          )}

          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-white px-5 py-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save Session"}
            </button>
          </div>

          <datalist id="shooters-list">
            {uniqueShooters.map((name, i) => (
              <option key={i} value={name} />
            ))}
          </datalist>
        </form>
      </div>
    </div>
  );
}
