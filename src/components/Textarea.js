import React from "react";
import { Textarea as ChakraTextarea } from "@chakra-ui/react";

const Textarea = ({
  placeholder,
  value,
  onChange,
  variant = "outline",
  isInvalid,
  minHeight,
  isDisabled,
}) => {
  return (
    <ChakraTextarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      minHeight={minHeight}
      isDisabled={isDisabled}
      rounded="sm"
      borderColor="blue.700"
      borderWidth="2px"
      _hover={{
        borderColor: "blue.600",
        background: "gray.700",
      }}
      _focus={{
        background: "gray.700",
      }}
      variant={variant}
      isInvalid={isInvalid}
    />
  );
};

export default Textarea;
