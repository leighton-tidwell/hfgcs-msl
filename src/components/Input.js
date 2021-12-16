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
  size,
  isInvalid,
  onBlur,
}) => {
  return (
    <ChakraInput
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      isDisabled={isDisabled}
      name={name}
      size={size}
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
