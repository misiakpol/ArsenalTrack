"use client";

import React, { useState } from "react";
import BoxContainer from "@/components/boxContainer";
import { Trash, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrainingLog } from "@/types";
import {
  ColumnDef,
  flexRender,
  createCoreRowModel,
  createSortedRowModel,
  createFilteredRowModel,
  SortingState,
  useTable,
} from "@tanstack/react-table";

interface TrainingLogsTableProps {
  logs: TrainingLog[];
  onDelete: (id: string) => void;
}

export default function TrainingLogsTable({ logs, onDelete }: TrainingLogsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<TrainingLog>[] = [
    {
      accessorKey: "session_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("session_date"));
        return <div className="font-medium">{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "firearm_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Firearm
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const firearmName = row.original.firearms?.name;
        return <div>{firearmName || row.getValue("firearm_id")}</div>;
      },
    },
    {
      accessorKey: "shooter_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Shooter
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("shooter_name")}</div>,
    },
    {
      accessorKey: "drill_type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Drill
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("drill_type")}</div>,
    },
    {
      accessorKey: "distance_m",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Distance (m)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("distance_m")}</div>,
    },
    {
      id: "score",
      accessorFn: (row) => `${row.score} / ${row.max_score}`,
      header: "Score",
      cell: ({ row }) => {
        const score = row.original.score;
        const max = row.original.max_score;
        return <div>{score} / {max}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const log = row.original;
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(log.id)}
              className="text-red-500 hover:bg-red-50 hover:text-red-700"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useTable({
    data: logs,
    columns,
    features: [
      createCoreRowModel(),
      createSortedRowModel(),
      createFilteredRowModel(),
    ],
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="mb-3 grid grid-cols-1 gap-2">
      <BoxContainer title="Training Logs">
        <div className="flex items-center pb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search training logs..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getAllCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No training logs recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </BoxContainer>
    </div>
  );
}
