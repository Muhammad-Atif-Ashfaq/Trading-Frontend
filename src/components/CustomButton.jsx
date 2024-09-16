import React from "react";
import { Button, theme } from "antd";
import CustomLoader from '../components/CustomLoader'

const CustomButton = ({ className, style, Text, onClickHandler, icon, disabled, backgroundColor, borderColor, loading }) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  return (
    <Button
      type="primary"
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgroundColor ? backgroundColor : colorPrimary,
        border: `1px solid ${borderColor ? borderColor : colorPrimary}`,
        outline: "none",
        ...style,
      }}
      onClick={onClickHandler}
      disabled={disabled}
    >
      {" "}
      {loading ? <CustomLoader color='white' /> : (icon ? <>{icon} {Text}</> : Text)}
      {/* {icon && icon} {Text} */}
    </Button>
  );
};

export default CustomButton;
