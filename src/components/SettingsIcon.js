import React from "react";
import { Icon } from "@chakra-ui/react";

const SettingsIcon = ({ color, width, height }) => {
  return (
    <Icon width="30px" height="30px" viewBox="0 0 30 30" fill="none">
      <path
        d="M26.25 23.75H11.25M3.75 6.25H8.75H3.75ZM26.25 6.25H13.75H26.25ZM3.75 15H18.75H3.75ZM26.25 15H23.75H26.25ZM3.75 23.75H6.25H3.75Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11.25 8.75C12.6307 8.75 13.75 7.63071 13.75 6.25C13.75 4.86929 12.6307 3.75 11.25 3.75C9.86929 3.75 8.75 4.86929 8.75 6.25C8.75 7.63071 9.86929 8.75 11.25 8.75Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21.25 17.5C22.6307 17.5 23.75 16.3807 23.75 15C23.75 13.6193 22.6307 12.5 21.25 12.5C19.8693 12.5 18.75 13.6193 18.75 15C18.75 16.3807 19.8693 17.5 21.25 17.5Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8.75 26.25C10.1307 26.25 11.25 25.1307 11.25 23.75C11.25 22.3693 10.1307 21.25 8.75 21.25C7.36929 21.25 6.25 22.3693 6.25 23.75C6.25 25.1307 7.36929 26.25 8.75 26.25Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
};

export default SettingsIcon;
