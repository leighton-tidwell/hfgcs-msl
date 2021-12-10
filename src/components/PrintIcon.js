import React from "react";
import { Icon } from "@chakra-ui/react";

const PrintIcon = ({ color, width, height }) => {
  return (
    <Icon width="30px" height="30px" viewBox="0 0 30 30" fill="none">
      <path
        d="M27.5 10H2.5V21.25H7.5V26.25H22.5V21.25H27.5V10ZM20 23.75H10V17.5H20V23.75ZM23.75 15C23.0625 15 22.5 14.4375 22.5 13.75C22.5 13.0625 23.0625 12.5 23.75 12.5C24.4375 12.5 25 13.0625 25 13.75C25 14.4375 24.4375 15 23.75 15ZM22.5 3.75H7.5V8.75H22.5V3.75Z"
        fill="white"
      />
    </Icon>
  );
};

export default PrintIcon;
