"use client";

import { useAuth } from "@/components/AuthProvider";
import { Combobox } from "@/components/dashboard/Combobox";
import { DataTable } from "@/components/dashboard/DataTable";
import GenericError from "@/components/GenericError";
import SortButton from "@/components/SortButton";
import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Course } from "@/lib/dashboard/courses";
import { FacultyResponse, facultiesUrl } from "@/lib/dashboard/faculties";
import {
  Progress,
  progressesUrl,
  ProgressResponse,
} from "@/lib/dashboard/progresses";
import { StudentResponse, studentsUrl } from "@/lib/dashboard/students";
import { useFetchCollection } from "@/lib/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

export default function FacultyCourses() {
  const { user, token } = useAuth();
  const {
    data: facultyData,
    isLoading: facultyIsLoading,
    error: facultyError,
  } = useFetchCollection<FacultyResponse>(facultiesUrl, token, {
    depth: 2,
    where: { "user.email": { equals: user!.email } },
  });
  const faculty = facultyData?.docs?.at(0);

  const {
    data: studentData,
    isLoading: studentIsLoading,
    error: studentError,
  } = useFetchCollection<StudentResponse>(
    () => (!!facultyData ? studentsUrl : null),
    token,
    {
      depth: 2,
      where: {
        "courses.code": {
          in: faculty?.courses.map((course) => course.code).toString(),
        },
      },
    }
  );
  const {
    data: progressData,
    isLoading: progressIsLoading,
    error: progressError,
  } = useFetchCollection<ProgressResponse>(
    () => (!!facultyData ? progressesUrl : null),
    token,
    {
      depth: 2,
      where: {
        "subject.code": {
          in: faculty?.subjects.map((subject) => subject.code).toString(),
        },
      },
    }
  );

  const students = studentData?.docs;
  const progresses = progressData?.docs;

  const [value, setValue] = useState("");

  const filteredProgresses = progresses?.filter(
    (progress) => progress.student.id === value
  );
  const filteredProgressPercents = filteredProgresses?.map(
    (progress) => progress.percent
  );

  const [percents, setPercents] = useState<number[] | undefined>(() =>
    filteredProgresses?.map((progress) => progress.percent)
  );
  useEffect(() => {
    if (progressData) {
      setPercents(
        progressData?.docs
          ?.filter((progress) => progress.student.id === value)
          ?.map((progress) => progress.percent)
      );
    }
  }, [progressData, value]);

  const studentsOptions = students?.map((val) => {
    return { value: val.id, label: val.user.name };
  });

  // TODO: useMemo
  const columns: ColumnDef<Progress>[] = useMemo(
    () => [
      {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => {
          return row.original.subject.name;
        },
      },
      {
        accessorKey: "percent",
        header: "Progress",
        cell: ({ row }) => {
          return (
            <div className="flex items-center">
              <span className="w-12">{percents?.at(row.index)}%</span>
              <Slider
                value={[percents?.at(row.index)!]}
                // TODO: onValueChange={}
                max={100}
                step={1}
              />
            </div>
          );
        },
      },
    ],
    [percents]
  );

  const isLoading = facultyIsLoading || studentIsLoading || progressIsLoading;
  const isError = !!facultyError || !!studentError || !!progressError;

  if (isLoading) {
    return <Spinner variant="page" />;
  }

  if (isError) {
    return <GenericError variant="error" />;
  }

  /*TODO: Better still, move this to parallel route layout */
  if (user?.roles === "admin") {
    return <GenericError variant="notImpl" />;
  }

  return (
    <div className="space-y-3">
      <Combobox
        options={studentsOptions!}
        label="student"
        state={{ value: value, setValue: setValue }}
      />
      <DataTable columns={columns} data={filteredProgresses!} />
    </div>
  );
}
