import React, { useState, useCallback } from "react";
import { PlusIcon, XIcon } from "@heroicons/react/outline";
import { useDropzone } from "react-dropzone";
import { Formik } from "formik";
import { Button, FormDrawer, TextArea, Spinner } from "../../common";

import { NotesApi } from "../../api";
import supabase from "../../api/supabase";

export const CreateNote = ({ column, type, id }) => {
  const createNoteMutation = NotesApi.useCreateNote();

  return (
    <FormDrawer
      isDone={createNoteMutation.isSuccess}
      triggerButton={
        <Button size="sm" type="submit" startIcon={<PlusIcon className="h-4 w-4" />}>
          Create Note
        </Button>
      }
      title="Create Note"
      submitButton={
        <Button
          form="create-note"
          type="submit"
          size="sm"
          isLoading={createNoteMutation.isLoading}
          isDone={createNoteMutation.isSuccess}
        >
          Submit
        </Button>
      }
    >
      <Formik
        initialValues={{
          notes: "",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await createNoteMutation.mutateAsync({
            notes: values.notes || "",
            [column]: id,
          });
          setSubmitting(true);
          resetForm();
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched }) => (
          <form onSubmit={handleSubmit} id="create-note">
            <TextArea
              title="Notes"
              id="notes"
              type="text"
              value={values.notes}
              handleChange={handleChange}
            />
          </form>
        )}
      </Formik>
    </FormDrawer>
  );
};
