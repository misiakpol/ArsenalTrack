"use client";

import React, { useState, useMemo } from "react";
import BoxContainer from "@/components/boxContainer";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShootingLog } from "@/types";
import { DataTable, DataTableSortStatus } from "mantine-datatable";

interface SessionsTableProps {
  logs: ShootingLog[];
  onDelete: (id: string) => void;
}

export default function SessionsTable({ logs, onDelete }: SessionsTableProps) {
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<ShootingLog>
  >({
    columnAccessor: "session_date",
    direction: "desc",
  });

  const sortedLogs = useMemo(() => {
    const result = [...logs];
    result.sort((a, b) => {
      const accessor = sortStatus.columnAccessor as keyof ShootingLog;
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
  }, [logs, sortStatus]);

  return (
    <div className="mb-3 grid grid-cols-1 gap-2">
      <BoxContainer title="Shooting Logs">
        <div className="[&_tbody_tr:last-child]:!border-b-0 [&_tbody_tr:last-child_td]:!border-b-0">
          <DataTable
            classNames={{
              header: "bg-gray-50 [&_th]:!py-5",
            }}
            striped
            highlightOnHover
            minHeight={150}
            emptyState="No sessions recorded yet."
            records={sortedLogs}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            columns={[
              {
                accessor: "session_date",
                title: "Date",
                sortable: true,
                render: (record) => (
                  <div className="font-medium" suppressHydrationWarning>
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
                accessor: "rounds_fired",
                title: "Rounds Fired",
                sortable: true,
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
                    className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-700"
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
