import React from "react";
import { Button, Col, FormFeedback, FormText, Label, Row } from "reactstrap";
import { useField, useFormikContext } from "formik";

import RawField from "./RawField";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NumberField = ({
  name,
  label,
  placeHolder,
  required,
  disabled,
  withoutFeedback,
  helpText,
  append,
  max,
  onChange,
  ...rest
}) => {
  const { isSubmitting } = useFormikContext();
  const [field, meta, { setValue }] = useField(name);

  return (
    <Row>
      <Col>
        {label && (
          <div>
            <Label>
              {label}
              {required && <em> * </em>}
            </Label>
          </div>
        )}
        {helpText && (
          <div>
            <FormText>{helpText}</FormText>
          </div>
        )}
      </Col>
      <Col className="text-end">
        <RawField
          type={"number"}
          {...field}
          invalid={!!meta.error}
          disabled={isSubmitting || disabled}
          required={required}
          placeholder={placeHolder || label}
          className={rest?.className ? rest?.className + "d-none" : "d-none"}
          {...rest}
        />
        <div className="d-inline">
          <Button
            className="number-btn me-3"
            onClick={async () => {
              const val = meta.value > 1 ? meta.value - 1 : 1;
              await setValue(val);
              onChange && onChange(val);
            }}
          >
            <FontAwesomeIcon icon={faMinus} />
          </Button>
          <div className="field-number-value d-inline-block">{meta.value}</div>
          <Button
            className="number-btn ms-3"
            onClick={async () => {
              const val = max && meta.value < max ? meta.value + 1 : meta.value;
              await setValue(val);
              onChange && onChange(val);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
      </Col>
      {/*{append && <InputGroupText>{append}</InputGroupText>}*/}
      {!withoutFeedback && <FormFeedback>{meta.error}</FormFeedback>}
    </Row>
  );
};

export default NumberField;
