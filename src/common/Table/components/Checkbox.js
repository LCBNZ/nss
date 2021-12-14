import React, { useEffect, forwardRef, useRef } from "react";

export const Checkbox = forwardRef(({ indeterminate, ...rest }, disabled, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;
  //
  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <input
      disabled={disabled ? true : false}
      className="focus:outline-none"
      type="checkbox"
      ref={resolvedRef}
      {...rest}
    />
  );
});
