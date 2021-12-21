import React, { useState, useEffect } from "react";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { getShiftPersonnel } from "../api";

const ShiftSelect = ({ onClick, shiftName }) => {
  const [operatorList, setOperatorList] = useState([]);

  const fetchOperators = async () => {
    const data = await getShiftPersonnel(shiftName);
    setOperatorList(data);
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  return (
    <Box
      onClick={onClick}
      cursor="pointer"
      bg="gray.800"
      color="white"
      minWidth="350px"
      rounded="sm"
      p={3}
    >
      <Text fontWeight="600" textAlign="center">
        {shiftName}
      </Text>
      <Text>
        {!operatorList.length && <Spinner size="xl" />}
        {operatorList.map((operator) => (
          <Text>
            {operator.rank} {operator.lastname}
          </Text>
        ))}
      </Text>
    </Box>
  );
};

export default ShiftSelect;
