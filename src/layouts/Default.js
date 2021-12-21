import React from "react";
import { SecretBanner } from "../components";
import { Container } from "@chakra-ui/react";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <SecretBanner />
      <Container maxW="container.xxl" p={10} height="calc(100VH-32px)">
        {children}
      </Container>
    </>
  );
};

export default DefaultLayout;
