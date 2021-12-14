import React from "react";
import { Input } from "../../common/Form/Input";

export function Zone({ index, key, title }) {
  return (
    <>
      <Input title={title} id={`Zone${index}`} labelInline />
    </>
  );
}
