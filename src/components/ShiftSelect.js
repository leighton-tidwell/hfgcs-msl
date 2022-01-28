import React, { useState, useEffect } from "react";
import { Box, Text, Spinner, useToast } from "@chakra-ui/react";
import { getShiftPersonnel } from "../api";

const ShiftSelect = ({ onClick, shiftName }) => {
  const [operatorList, setOperatorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchOperators = async () => {
    try {
      const data = await getShiftPersonnel(shiftName);
      setOperatorList(data);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }

    setLoading(false);
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
      <Text fontWeight="600" fontSize="lg" textAlign="center">
        {shiftName}
      </Text>
      <Text>
        {loading ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Spinner size="xl" />
          </Box>
        ) : (
          operatorList.map((operator) => (
            <Text key={operator.Id}>
              {operator.rank} {operator.lastname}
            </Text>
          ))
        )}
      </Text>
    </Box>
  );
};

export default ShiftSelect;
