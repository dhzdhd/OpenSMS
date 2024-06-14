import axios from "axios";
import { API_URL } from "../constants";
import useSWR, { Fetcher } from "swr";
import { GetResponse } from "../utils";

export interface Logo {
  alt: string;
  url: string;
}

export interface Metadata {
  id: number;
  logo: Logo;
  title: string;
}

const fetcher: Fetcher<Metadata> = (url: string) =>
  axios.get(url).then((res) => res.data);

// TODO: Create local image instead of URL
export const placeholderUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png";

export function useMetadata() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Metadata>(
    `${API_URL}/api/globals/metadata?locale=undefined&draft=false&depth=1`,
    fetcher,
    { revalidateIfStale: false }
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } satisfies GetResponse<Metadata>;
}

export function mapMetadata(metadata: Metadata): Metadata {
  let url: string | undefined = metadata?.logo?.url;

  return {
    ...metadata,
    logo: {
      ...metadata.logo,
      url: url ? `${API_URL}${url}` : placeholderUrl,
    },
  };
}
