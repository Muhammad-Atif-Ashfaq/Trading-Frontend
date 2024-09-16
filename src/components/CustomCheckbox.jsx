import React from "react";
import { Checkbox, theme } from "antd";
import styled, { css } from "styled-components";

const CustomsCheckbox = styled(Checkbox)`
  ${(props) =>
    props.backgroundColor &&
    css`
      & .ant-checkbox-checked .ant-checkbox-inner {
        background-color: ${props.backgroundColor};
        border-color: ${props.backgroundColor};
      }
    `}
`;

const CustomCheckbox = ({ title, value, onChange, checked, indeterminate, label, className, disabled }) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  return (
    <div className="flex items-center gap-3 py-3">
    <CustomsCheckbox
      backgroundColor={colorPrimary}
      value={value}
      onChange={onChange}
      checked={checked}
      indeterminate={indeterminate}
      className={className}
      disabled={disabled}
    >
      {title}
    </CustomsCheckbox>
    <label>{label}</label>
    </div>
  );
};

export default CustomCheckbox;
