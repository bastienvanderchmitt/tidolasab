import React from "react";
import { useField, useFormikContext } from "formik";
import { Input } from "reactstrap";

const RawField = ({
  type,
  name,
  required,
  disabled,
  withoutFeedback,
  ...rest
}) => {
  const { isSubmitting } = useFormikContext();
  const [field, meta] = useField(name);

  return (
    <Input
      type={type}
      {...field}
      invalid={!withoutFeedback ? meta.touched && !!meta.error : !!meta.error}
      disabled={isSubmitting || disabled}
      {...rest}
    />
  );
};

export default RawField;
