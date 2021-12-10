import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";

const Logo = () => {
  return (
    <Box display="flex" flexGrow="1">
      <Image src="./images/logo.png" alt="logo" />
      <Box pt={5} display="flex" flexDir="column" justifyContent="center">
        <Text color="white" fontWeight="800" lineHeight=".8em" fontSize="100px">
          ANCS
        </Text>
        <Text color="white" fontWeight="500" lineHeight=".8em" fontSize="48px">
          MASTER STATION LOG
        </Text>
      </Box>
    </Box>
  );
};

export default Logo;
