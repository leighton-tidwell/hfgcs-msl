import React from "react";
import { SecretBanner } from "../components";
import { Container } from "@chakra-ui/react";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <SecretBanner />
      <Container maxW="container.xxl" p={10} height="100VH">
        {children}
      </Container>
    </>
  );
};

export default DefaultLayout;
