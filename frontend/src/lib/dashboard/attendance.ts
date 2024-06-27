import { Relation } from "../utils";
import { Course } from "./courses";
import { Student } from "./students";
import { API_URL } from "../constants";

export interface Attendance {
  id: string;
  date: string;
  isPresent: boolean;
  course: Relation<Course>;
  student: Relation<Student>;
}
export interface AttendanceResponse {
  docs?: Attendance[];
}
export interface AttendancePayload {
  date: string;
  isPresent: boolean;
  student: Relation<string>; // student ID
  course: Relation<string>; // course ID
}

export const attendancesUrl = `${API_URL}/api/attendances`;

// TODO: Make transformer return new type/modified type
