import React, { useState } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { SplashPage, MSLPage } from "./pages";
import { Box } from "@chakra-ui/react";

const customTheme = extendTheme({
  components: {
    Table: {
      variants: {
        msltable: {
          th: {
            color: "white",
            fontSize: "sm",
            background: "#081935",
          },
          tr: {
            _even: {
              background: "#081935",
            },
          },
          td: {
            border: "1px dotted #2D3748",
            borderBottom: "2px solid #2D3748",
          },
        },
      },
    },
    Tabs: {
      variants: {
        enclosed: {
          tablist: {
            borderColor: "gray.800",
          },
          tab: {
            _selected: {
              background: "#010711",
              color: "white",
              border: "1px solid gray.800",
              fontWeight: "bold",
            },
            _focus: {
              boxShadow: "none",
            },
          },
        },
      },
    },
  },
});

const App = () => {
  const [shift, setShift] = useState(null);

  return (
    <ChakraProvider theme={customTheme}>
      <Box bg="gray.700" height="100VH" overflow="hidden">
        {!shift ? (
          <SplashPage setShift={setShift} />
        ) : (
          <MSLPage shift={shift} />
        )}
      </Box>
    </ChakraProvider>
  );
};

export default App;
