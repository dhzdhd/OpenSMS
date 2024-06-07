"use client";

import { useAuth } from "@/components/AuthProvider";
import { DataTable } from "@/components/dashboard/DataTable";
import FeeTable from "@/components/dashboard/finance/FeeTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFees } from "@/lib/dashboard/finance";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Fee } from "@/lib/dashboard/finance";
import Spinner from "@/components/Spinner";
import { Combobox } from "@/components/dashboard/Combobox";
import React from "react";
import { AddFeeDialog } from "@/components/dashboard/finance/AddFeeDialog";
import { useStudents } from "@/lib/dashboard/user-profile";

export default function Finance() {
  const columns: ColumnDef<Fee>[] = [
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    { accessorKey: "paymentStatus", header: "Payment status" },
  ];

  const { token } = useAuth();
  // TODO: Use multiple req instead https://github.com/vercel/swr/discussions/786
  const {
    data: feeData,
    error: feeError,
    isLoading: feeIsLoading,
  } = useFees(token);
  const {
    data: studentData,
    error: studentError,
    isLoading: studentIsLoading,
  } = useStudents(token);
  const [value, setValue] = React.useState("");

  const students = studentData?.docs;
  const studentsOptions = students?.map((val) => {
    return { value: val.id, label: val.user.value.name };
  });

  const studentFeeData = feeData?.docs?.filter(
    (val) => val.student.value.id === value
  );

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Finance</h1>
      </div>
      {feeIsLoading || feeError || studentIsLoading || studentError ? (
        <Spinner size="32" />
      ) : (
        <div className="flex flex-col gap-3">
          <Combobox
            options={studentsOptions!}
            label="student"
            state={{ value: value, setValue: setValue }}
          />
          <DataTable columns={columns} data={studentFeeData!} />
          {value !== "" && (
            <AddFeeDialog
              student={students?.filter((val) => val.id === value)[0]}
            />
          )}
        </div>
      )}
    </main>
  );
}
