import { ExclamationIcon, InformationCircleIcon } from "@heroicons/react/outline";
import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../Button";
import { Dialog, DialogTitle } from "../Dialog";
import { useDisclosure } from "../../hooks/useDisclosure";

import supabase from "../../api/supabase";

export const FileUpload = ({
  triggerButton,
  confirmButton,
  cancelButtonText = "Cancel",
  isDone = false,
}) => {
  const onDrop = React.useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    // const { data, error } = await supabase.storage
    //   .from("job-files")
    //   .upload(`public/${file.name}`, file, {
    //     cacheControl: "3600",
    //     upsert: false,
    //   });
    const { data, error } = await supabase.storage.list()


  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const { close, open, isOpen } = useDisclosure();

  const cancelButtonRef = React.useRef(null);

  React.useEffect(() => {
    if (isDone) {
      close();
    }
  }, [isDone, close]);

  const trigger = React.cloneElement(triggerButton, {
    onClick: open,
  });

  return (
    <>
      {trigger}
      <Dialog isOpen={isOpen} onClose={close} initialFocus={cancelButtonRef}>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
                File Upload
              </DialogTitle>
            </div>
          </div>

          <div {...getRootProps()}>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      {...getInputProps()}
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-2 justify-end">
            <Button type="button" variant="inverse" onClick={close} ref={cancelButtonRef}>
              {cancelButtonText}
            </Button>
            {confirmButton}
          </div>
        </div>
      </Dialog>
    </>
  );
};
