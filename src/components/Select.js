import React from "react";
import { Select as ChakraSelect } from "@chakra-ui/react";

const Select = ({
  children,
  variant = "outline",
  onChange,
  value,
  placeholder,
  name,
  isDisabled,
  size,
}) => {
  return (
    <ChakraSelect
      rounded="sm"
      variant={variant}
      onChange={onChange}
      value={value}
      name={name}
      size={size}
      isDisabled={isDisabled}
      placeholder={placeholder}
      borderColor="blue.700"
      borderWidth="2px"
      _hover={{
        borderColor: "blue.600",
        background: "gray.700",
      }}
      _focus={{
        background: "gray.700",
      }}
      sx={{
        "& option": {
          color: "gray.700",
        },
      }}
    >
      {children}
    </ChakraSelect>
  );
};

export default Select;
