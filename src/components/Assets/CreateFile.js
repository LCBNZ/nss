import React, { useState, useCallback } from "react";
import { PlusIcon, XIcon } from "@heroicons/react/outline";
import { useDropzone } from "react-dropzone";
import { Formik } from "formik";
import { Button, FormDrawer, Input, Spinner } from "../../common";

import { FilesApi } from "../../api";
import supabase from "../../api/supabase";

export const CreateFile = ({ field, setFieldValue }) => {
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const createFileMutation = FilesApi.useCreateFile();

  const onDrop = useCallback(async (files) => {
    if (files?.length > 0 && files?.length < 2) {
      setFileLoading(true);
      const file = files[0];

      const random = Math.floor(Math.random() * 1000);
      const splitFileName = file.name.split(".")[0];
      const splitFileExt = file.name.split(".")[1];
      const fileName = `${splitFileName}${random}.${splitFileExt}`;

      const { data, error } = await supabase.storage
        .from("files")
        .upload(`asset/${fileName}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!error) {
        const fetchFile = await supabase.storage.from("files").getPublicUrl(`asset/${fileName}`);

        setFileUrl(fetchFile?.data.publicURL);
        setFileName(fileName);


        setFieldValue(field, fetchFile?.data.publicURL);
      }

      setFileLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeUploadedFile = async () => {


    if (fileName) {
      const removeFile = await supabase.storage.from("files").remove([`asset/${fileName}`]);


      if (!removeFile.error) {

        setFileName("");
        setFileUrl("");
      }
    }
  };

  return (
    <>
      {fileLoading && !fileUrl && (
        <div className="w-full h-48 flex justify-center items-center">
          <Spinner size="sm" />
          <p>Uploading File...</p>
        </div>
      )}
      {!fileLoading && !fileUrl ? (
        <div className="px-4" {...getRootProps()}>
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
                <div className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  {!isDragActive && (
                    <div>
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" {...getInputProps()} />
                    </div>
                  )}
                </div>
                {!isDragActive ? (
                  <p className="pl-1">or drag and drop</p>
                ) : (
                  <p className="pl-1">Drop file here</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-4">
          <h3 className="text-gray-700 leading-6 text-md font-semibold">
            File successfully uploaded!
          </h3>
          <div className="flex items-center pt-4">
            <button type="button" onClick={removeUploadedFile}>
              <XIcon className="text-red-400 h-4 w-4" />
            </button>
            <span className="text-blue-400 pl-2">{fileName}</span>
          </div>
        </div>
      )}
    </>
  );
};
