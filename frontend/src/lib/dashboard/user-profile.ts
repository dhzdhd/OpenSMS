import axios from "axios";
import { API_URL } from "../constants";
import useSWR, { Fetcher } from "swr";
import { GetResponse, Relation } from "../utils";
import qs from "qs";
import { UserRelation } from "../login/login";
import { Course } from "./courses";

// TODO: Check query
export interface Student {
  id: string;
  studentId: number;
  number: number;
  dob: string;
  courses: Relation<Course>[];
  user: UserRelation;
  photo: {
    alt: string;
    url: string;
  };
}

export interface StudentResponse {
  docs: Student[];
}

const fetcher: Fetcher<StudentResponse> = (url: string) =>
  axios.get(url).then((res) => res.data);

export function useStudent(email: string) {
  const query = qs.stringify(
    {
      where: {
        "user.value.email": {
          equals: email,
        },
      },
    },
    { addQueryPrefix: true }
  );

  const { data, error, isLoading } = useSWR<StudentResponse>(
    `${API_URL}/api/students${query}`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
  } satisfies GetResponse<StudentResponse | undefined>;
}

export function mapStudent(student: Student | undefined): Student | undefined {
  if (student) {
    const dob = new Date(`${student.dob}`);

    return {
      ...student,
      photo: {
        ...student.photo,
        url: `${API_URL}${student.photo.url}`,
      },
      dob: dob.toDateString(),
    };
  }
}
