import { signUp } from "@/actions/signup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSignup = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: signUp,

    onSuccess: (data) => {
      if (data.error?.message || !data.success) {
        toast.error(data.error?.message);
      }
      if (data.data) {
        toast.success("account successfully created ");
      }
    },

    onError: () => {
      toast.error("failed to create account");
    },
  });

  return {
    isPending,
    mutate,
  };
};
