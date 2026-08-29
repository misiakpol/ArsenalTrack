"use client";

import React from "react";
import BoxContainer from "@/components/boxContainer";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShootingLog } from "@/types";

interface SessionsTableProps {
  logs: ShootingLog[];
  onDelete: (id: string) => void;
}

export default function SessionsTable({ logs, onDelete }: SessionsTableProps) {
  return (
    <div className="mb-3 grid grid-cols-1 gap-2">
      <BoxContainer title="Shooting Logs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Firearm</TableHead>
                <TableHead>Rounds Fired</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-gray-500"
                  >
                    No sessions recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium" suppressHydrationWarning>
                      {new Date(log.session_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{log.firearm_id}</TableCell>
                    <TableCell>{log.rounds_fired}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(log.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </BoxContainer>
    </div>
  );
}
