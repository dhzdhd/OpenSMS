import axios, { AxiosError, AxiosResponse } from "axios";
import useSWR from "swr";
import { API_URL } from "../constants";
import { AuthPayload, GetResponse, PostResponse } from "../utils";
import useSWRMutation from "swr/mutation";

export interface AnnouncementPayload {
  title: string;
  content: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: any;
  contentHtml: string;
  createdAt: string;
}

export interface AnnouncementResponse {
  docs: Announcement[];
}

export function useAnnouncements(token?: string) {
  const { data, error, isLoading } = useSWR<AnnouncementResponse, AxiosError>(
    `${API_URL}/api/announcements?draft=false&depth=1`,
    (url: string) =>
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res: AxiosResponse<AnnouncementResponse>) => res.data)
  );

  // TODO: Check whether data mapping can be done here
  return {
    data,
    error,
    isLoading,
  } satisfies GetResponse<AnnouncementResponse | undefined>;
}

export function mapAnnouncements(announcement: Announcement): Announcement {
  const date = new Date(`${announcement.createdAt}`);

  const minutes = date.getMinutes();
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return {
    ...announcement,
    createdAt: `${date.toDateString()} | ${date.getHours()}:${minutesString}`,
  };
}

const postFetcher = (
  url: string,
  { arg }: { arg: AuthPayload<AnnouncementPayload> }
) =>
  axios
    .post(url, JSON.stringify(arg.payload), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${arg.token}`,
      },
    })
    .then((res) => res.data);

export function useCreateAnnouncements() {
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/api/announcements`,
    postFetcher
  );

  return {
    trigger,
    isMutating,
  } satisfies PostResponse<AnnouncementPayload, AxiosError>;
}
