import { useMutation, useQueryClient } from "react-query";
import supabase from "../supabase";

export const deleteFile = async ({ fileId }) => {

  const { data, error } = await supabase
    .from("files")
    .delete()
    .match({ id: Number(fileId) });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useDeleteFile = ({ fileId }) => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async (deletedFile) => {
      await queryClient.cancelQueries(["files", fileId]);

      const previousFiles = queryClient.getQueryData(["files", fileId]);

      queryClient.setQueryData(
        ["files", fileId],
        previousFiles?.filter((asset) => asset.id !== deletedFile?.fileId),
      );

      return { previousFiles };
    },
    onError: (_, __, context) => {
      if (context?.previousFiles) {
        queryClient.setQueryData(["files", fileId], context.previousFiles);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["files", fileId]);
    },
    mutationFn: deleteFile,
  });
};
