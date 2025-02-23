"use client"
import {
  useQuery,
} from "@tanstack/react-query";

export const useQueryData = (
  queryKey,
  queryFn,
  options
) => {
  const { data, isPending, isFetched, refetch, isFetching } = useQuery({
    queryKey,
    queryFn,
    refetchInterval: options?.refetchInterval,
    });
  return { data, isPending, isFetched, refetch, isFetching };
};
