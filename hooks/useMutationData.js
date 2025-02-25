import { useMutation, useMutationState, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useMutationData = (
    mutationKey,
    mutationFn,
    queryKey,
    onSuccess
) => {
    const client = useQueryClient();
    const { mutate, isPending, isSuccess,error } = useMutation({
        mutationKey,
        mutationFn,
        onError(error) {
            const data = error.response?.data;
            console.log(data, "error");
            if (data?.message) toast.error(data.message);
            else toast.error("An unexpected error occurred.", {
                description: error.message?.toString()
            });
        },
        onSuccess(data) {
            if (onSuccess) onSuccess(data);
        },
        onSettled: async () => {
            return await client.invalidateQueries({ queryKey: [queryKey], exact: true });
        }
    });
    return { mutate, isPending, isSuccess,error };
}

export const useMutationDataState = (mutationKey) => {
    const data = useMutationState({
        filters: {
            mutationKey
        },
        select(mutation) {
            return {
                variables: mutation.state.variables,
                status: mutation.state.status,
            };
        },
    });
    const latestVariables = data[data.length - 1];
    return { latestVariables };
}
