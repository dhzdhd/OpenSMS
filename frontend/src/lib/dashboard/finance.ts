import axios, { AxiosError, AxiosResponse } from "axios";
import useSWR, { Key } from "swr";
import { API_URL } from "../constants";
import { GenericPayload, GetResponse, PostResponse, Relation } from "../utils";
import useSWRMutation from "swr/mutation";
import { Student } from "./students";

export interface Fee {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  paymentStatus: "unpaid" | "paid" | "delayed";
  student: Student;
}
// TODO: Find a way to make docs not undefined for mapping
export interface FeeResponse {
  docs?: Fee[];
}
export interface FeePayload {
  description: string;
  amount: number;
  dueDate: string;
  paymentStatus: string;
  student: string; // string here is the student ID
}

export const feesUrl = `${API_URL}/api/fees`;

export function feeTransformer(data?: FeeResponse): FeeResponse | undefined {
  return {
    docs: data?.docs?.map((fee) => {
      return { ...fee, dueDate: new Date(fee.dueDate) };
    }),
  };
}

export function useFees(token?: string): GetResponse<FeeResponse> {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    FeeResponse,
    AxiosError
  >(`${API_URL}/api/fees?draft=false&depth=2`, (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: AxiosResponse<FeeResponse>) => res.data)
  );

  const transformedData: FeeResponse | undefined = {
    docs: data?.docs?.map((fee) => {
      return { ...fee, dueDate: new Date(fee.dueDate) };
    }),
  };

  return {
    data: transformedData,
    error,
    isLoading,
    isValidating,
    mutate,
  } satisfies GetResponse<FeeResponse>;
}

const postFeeFetcher = (
  url: string,
  { arg }: { arg: GenericPayload<FeePayload> }
) =>
  axios
    .post(url, JSON.stringify(arg.payload), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${arg.token}`,
      },
    })
    .then((res: AxiosResponse<FeePayload>) => res.data)
    .catch((err) => err);

export function useCreateFee() {
  const { data, trigger, isMutating, error } = useSWRMutation<
    FeeResponse,
    AxiosError,
    Key,
    GenericPayload<FeePayload>,
    any
  >(`${API_URL}/api/fees`, postFeeFetcher);

  // const transformedData: Partial<OrderResponse> | undefined = {
  //   ...data,
  //   amountDue: data?.["amount_due"],
  //   amountPaid: data?.["amount_paid"],
  //   createdAt: data?.["created_at"],
  //   offerId: data?.["offer_id"],
  // };

  return {
    data,
    error,
    trigger,
    isMutating,
  } satisfies PostResponse<FeeResponse, AxiosError>;
}

export interface Order {
  amount: number;
  amountDue: number;
  amountPaid: number;
  attempts: number;
  createdAt: string;
  currency: string;
  entity: string;
  id: string;
  notes: string[];
  offerId?: string;
  receipt?: string;
  status: string;
}
interface OrderResponse extends Order {
  // TODO: amountDue and 3 others are undefined here
  amount_due: number;
  amount_paid: number;
  created_at: string;
  offer_id?: string;
}

const postOrderFetcher = (
  url: string,
  { arg }: { arg: GenericPayload<string> }
) =>
  axios
    .post(url, JSON.stringify(arg.payload), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${arg.token}`,
      },
    })
    .then((res: AxiosResponse<OrderResponse>) => res.data)
    .catch((err) => err);

export function useOrder(amount: number) {
  const { data, trigger, isMutating, error } = useSWRMutation<
    OrderResponse,
    AxiosError,
    Key,
    any,
    any
  >(`${API_URL}/api/fees/order/create/${amount}`, postOrderFetcher);
  // TODO: Consider returning a callback fn instead of using Partial
  const transformedData: Partial<OrderResponse> | undefined = {
    ...data,
    amountDue: data?.["amount_due"],
    amountPaid: data?.["amount_paid"],
    createdAt: data?.["created_at"],
    offerId: data?.["offer_id"],
  };

  return {
    data: transformedData,
    error,
    trigger,
    isMutating,
  } satisfies PostResponse<Partial<OrderResponse>, AxiosError>;
}
