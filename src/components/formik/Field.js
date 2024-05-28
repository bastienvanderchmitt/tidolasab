import React from "react";
import { FormFeedback, FormText, Label } from "reactstrap";
import { useField, useFormikContext } from "formik";

import RawField from "./RawField";

const Field = ({
  type,
  name,
  label,
  placeHolder,
  required,
  disabled,
  withoutFeedback,
  helpText,
  append,
  ...rest
}) => {
  const { isSubmitting } = useFormikContext();
  const [field, meta] = useField(name);

  return (
    <>
      {label && (
        <Label>
          {label}
          {required && <em> * </em>}
        </Label>
      )}
      <RawField
        type={type}
        {...field}
        invalid={!!meta.error && !!meta.touched}
        disabled={isSubmitting || disabled}
        required={required}
        placeholder={placeHolder || label}
        {...rest}
      />
      {/*{append && <InputGroupText>{append}</InputGroupText>}*/}
      {helpText && <FormText>{helpText}</FormText>}
      {!withoutFeedback && <FormFeedback>{meta.error}</FormFeedback>}
    </>
  );
};

export default Field;
