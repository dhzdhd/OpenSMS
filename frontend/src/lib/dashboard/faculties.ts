import { API_URL } from "../constants";
import { User } from "../login/login";
import { Relation } from "../utils";
import { Course } from "./courses";
import { Subject } from "./subjects";

export interface Faculty {
  id: string;
  facultyId: number;
  number: number;
  dob: string;
  courses: Course[];
  subjects: Subject[];
  user: User;
  photo: {
    alt: string;
    url: string;
  };
}
export interface FacultyResponse {
  docs?: Faculty[];
}
export const facultiesUrl = `${API_URL}/api/faculties`;

export function facultyTransformer(
  data?: FacultyResponse
): FacultyResponse | undefined {
  return {
    docs: data?.docs?.map((faculty) => {
      const dob = new Date(`${faculty.dob}`);

      return {
        ...faculty,
        photo: {
          ...faculty.photo,
          url: `${API_URL}${faculty.photo.url}`,
        },
        dob: dob.toDateString(),
      };
    }),
  };
}
