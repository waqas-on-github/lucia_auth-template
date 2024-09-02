import { logIn } from "@/actions/login";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogin = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: logIn,

    onSuccess: (data) => {
      if (data?.error?.message || !data?.success) {
        toast.error(data?.error?.message);
      }
      if (data?.data) {
        toast.success(" logged  in successfully ");
      }
    },

    onError: () => {
      toast.error("failed to login ..... ");
    },
  });

  return {
    isPending,
    mutate,
  };
};
