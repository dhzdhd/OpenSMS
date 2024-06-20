"use client";

import { useAuth } from "@/components/AuthProvider";
import Spinner from "@/components/Spinner";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import {
  facultiesUrl,
  FacultyResponse,
  facultyTransformer,
} from "@/lib/dashboard/faculties";
import { useFetchCollection } from "@/lib/hooks";
import Image from "next/image";

export default function UserProfile() {
  const { user, token } = useAuth();
  const { data, error, isLoading } = useFetchCollection<FacultyResponse>(
    facultiesUrl,
    token,
    { draft: false, depth: 2 },
    facultyTransformer
  );

  const faculty = data?.docs?.filter(
    (val) => val.user.value.email === user?.email
  )[0];
  console.log(data);

  if (isLoading) {
    return <Spinner size="32" />;
  }

  if (!!error) {
    return <div>Failed to load data</div>;
  }

  /*TODO: Better still, move this to parallel route layout */
  if (user?.roles === "admin") {
    return <div>Admin does not have user profile</div>;
  }

  return (
    <Table>
      <TableBody>
        <div className="flex items-center justify-center pb-5">
          <Image
            className="rounded-full w-72 aspect-square"
            src={faculty!.photo.url}
            alt={faculty!.photo?.alt ?? ""}
            width={500}
            height={500}
          ></Image>
        </div>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Name</div>
            <div className="text-lg text-muted-foreground md:inline">
              {faculty!.user.value.name}
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Faculty ID</div>
            <div className="text-lg text-muted-foreground md:inline">
              {faculty!.facultyId}
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Email</div>
            <div className="text-lg text-muted-foreground md:inline">
              {faculty!.user.value.email}
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Date Of Birth</div>
            <div className="text-lg text-muted-foreground md:inline">
              {faculty!.dob}
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="flex flex-row items-center justify-between">
          <TableCell>
            <div className="font-medium text-3xl">Number</div>
            <div className="text-lg text-muted-foreground md:inline">
              {faculty!.number}
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
