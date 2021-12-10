import React from "react";
import { Input as ChakraInput } from "@chakra-ui/react";

const Input = ({
  type,
  value,
  onChange,
  placeholder,
  variant = "outline",
  isDisabled = false,
  name,
  isInvalid,
}) => {
  return (
    <ChakraInput
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      name={name}
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

export default Input;
