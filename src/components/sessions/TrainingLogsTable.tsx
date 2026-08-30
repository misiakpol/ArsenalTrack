"use client";

import React, { useState, useMemo } from "react";
import BoxContainer from "@/components/boxContainer";
import { Trash, Search, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrainingLog } from "@/types";
import { DataTable, DataTableSortStatus } from "mantine-datatable";

interface TrainingLogsTableProps {
  logs: TrainingLog[];
  onDelete: (id: string) => void;
}

export default function TrainingLogsTable({
  logs,
  onDelete,
}: TrainingLogsTableProps) {
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<TrainingLog>
  >({
    columnAccessor: "session_date",
    direction: "desc",
  });
  const [globalFilter, setGlobalFilter] = useState("");

  const processedLogs = useMemo(() => {
    let result = [...logs];

    // Handle global filtering
    if (globalFilter) {
      const lowerQuery = globalFilter.toLowerCase();
      result = result.filter((log) => {
        return (
          new Date(log.session_date)
            .toLocaleDateString()
            .toLowerCase()
            .includes(lowerQuery) ||
          (log.firearms?.name || log.firearm_id)
            .toLowerCase()
            .includes(lowerQuery) ||
          (log.shooter_name || "").toLowerCase().includes(lowerQuery) ||
          (log.drill_type || "").toLowerCase().includes(lowerQuery) ||
          (log.distance_m?.toString() || "")
            .toLowerCase()
            .includes(lowerQuery) ||
          `${log.score} / ${log.max_score}`.includes(lowerQuery)
        );
      });
    }

    // Handle sorting
    result.sort((a, b) => {
      const accessor = sortStatus.columnAccessor as keyof TrainingLog;
      let aValue: any = a[accessor];
      let bValue: any = b[accessor];

      if (accessor === "session_date") {
        aValue = new Date(a.session_date).getTime();
        bValue = new Date(b.session_date).getTime();
      } else if (sortStatus.columnAccessor === "firearms.name") {
        aValue = a.firearms?.name || a.firearm_id;
        bValue = b.firearms?.name || b.firearm_id;
      }

      if (aValue === bValue) return 0;
      const compareResult = aValue < bValue ? -1 : 1;
      return sortStatus.direction === "asc" ? compareResult : -compareResult;
    });

    return result;
  }, [logs, sortStatus, globalFilter]);

  return (
    <div className="mb-3 grid grid-cols-1 gap-2">
      <BoxContainer title="Training Logs" icon={<List className="h-4 w-4" />}>
        <div className="flex items-center pb-4">
          <div className="black relative w-full max-w-sm">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Search training logs..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="[&_tbody_tr:last-child]:!border-b-0 [&_tbody_tr:last-child_td]:!border-b-0">
          <DataTable
            classNames={{
              header: "bg-gray-50 [&_th]:!py-5",
            }}
            striped
            highlightOnHover
            minHeight={150}
            emptyState="No training logs recorded yet."
            records={processedLogs}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            columns={[
              {
                accessor: "session_date",
                title: "Date",
                sortable: true,
                render: (record) => (
                  <div className="font-medium">
                    {new Date(record.session_date).toLocaleDateString()}
                  </div>
                ),
              },
              {
                accessor: "firearms.name",
                title: "Firearm",
                sortable: true,
                render: (record) => record.firearms?.name || record.firearm_id,
              },
              {
                accessor: "shooter_name",
                title: "Shooter",
                sortable: true,
              },
              {
                accessor: "drill_type",
                title: "Drill",
                sortable: true,
              },
              {
                accessor: "distance_m",
                title: "Distance (m)",
                sortable: true,
              },
              {
                accessor: "score",
                title: "Score",
                render: (record) => `${record.score} / ${record.max_score}`,
              },
              {
                accessor: "actions",
                title: "Actions",
                textAlign: "right",
                render: (record) => (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(record.id)}
                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </BoxContainer>
    </div>
  );
}
