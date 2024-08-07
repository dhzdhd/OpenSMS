import axios, { AxiosError, AxiosResponse } from "axios";
import useSWR, { Key } from "swr";
import qs from "qs";
import { GenericPayload, GetResponse, PostResponse } from "./utils";
import useSWRMutation from "swr/mutation";

export function useFetchCollection<TResponse>(
  url: Key | string,
  token?: string,
  query?: Record<string, any>,
  transformer?: (data?: TResponse) => TResponse | undefined
): GetResponse<TResponse> {
  const stringifiedQuery = query
    ? qs.stringify(query, { addQueryPrefix: true })
    : undefined;

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    TResponse,
    AxiosError
  >(url, (url: string) =>
    axios
      .get(`${url}${stringifiedQuery ?? ""}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: AxiosResponse<TResponse>) => res.data)
  );

  return {
    data: transformer ? transformer(data) : data,
    error,
    isLoading,
    isValidating,
    mutate,
  } satisfies GetResponse<TResponse>;
}

export function useMutateCollection<TData, TResponse, TPayload>(
  url: Key | string,
  method: "POST" | "PATCH" | "DELETE",
  populateCache?: (result: TData, currentData?: TResponse) => TResponse,
  transformer?: (data?: TData) => TData | undefined
) {
  type Payload = GenericPayload<Partial<TPayload>>;

  const { data, trigger, isMutating, error } = useSWRMutation<
    TData,
    AxiosError,
    Key | string,
    Payload,
    TResponse
  >(
    url,
    async (
      url: string,
      {
        arg,
      }: {
        arg: Payload;
      }
    ) => {
      const stringifiedQuery = arg.query
        ? qs.stringify(arg.query, { addQueryPrefix: true })
        : undefined;
      const aggUrl = `${url}/${arg.id ?? ""}${stringifiedQuery ?? ""}`;

      return axios
        .request({
          url: aggUrl,
          method: method,
          data: JSON.stringify(arg.payload),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${arg.token}`,
          },
        })
        .then((res: AxiosResponse<TData>) => res.data)
        .catch((err) => {
          throw err;
        });
    },
    {
      populateCache: populateCache,
      revalidate: !!populateCache,
      throwOnError: false,
    }
  );

  return {
    data: transformer ? transformer(data) : data,
    error,
    trigger,
    isMutating,
  } satisfies PostResponse<TData, AxiosError>;
}
