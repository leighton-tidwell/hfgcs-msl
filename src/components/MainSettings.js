import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Link,
  CloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { EditIcon, Input } from ".";
import {
  getBroadcastingSchedule,
  getMNCSSchedule,
  updateListItem,
} from "../api";

const MainSettings = () => {
  const [broadcastingSchedule, setBroadcastingSchedule] = useState([]);
  const [mncsSchedule, setMncsSchedule] = useState([]);
  const [error, setError] = useState("");

  const fetchBroadcastingSchedule = async () => {
    const response = await getBroadcastingSchedule();
    const formReadySchedule = response.map((item) => ({
      ...item,
      isEditable: false,
    }));

    setBroadcastingSchedule(formReadySchedule);
  };

  const fetchMNCSSchedule = async () => {
    const response = await getMNCSSchedule();
    const formReadySchedule = response.map((item) => ({
      ...item,
      isEditable: false,
    }));

    setMncsSchedule(formReadySchedule);
  };

  const toggleBroadcastItemEditable = async (Id) => {
    const changedItem = broadcastingSchedule.find((item) => item.Id === Id);

    const zuluTimeRegEx = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);
    const timeValidation = zuluTimeRegEx.test(changedItem.time);
    if (!timeValidation)
      return setError("You must enter a valid broadcast time.");

    if (changedItem.isEditable) {
      const updatedBroadcastItem = broadcastingSchedule.find(
        (item) => item.Id === Id
      );
      const formattedBroadcastItem = {
        Id: updatedBroadcastItem.Id,
        time: updatedBroadcastItem.time,
        ncs: updatedBroadcastItem.ncs,
      };
      const response = await updateListItem(
        "broadcastingschedule",
        formattedBroadcastItem
      );
    }

    setBroadcastingSchedule((prevSchedule) =>
      prevSchedule.map((item) =>
        item.Id === Id ? { ...item, isEditable: !item.isEditable } : item
      )
    );
  };

  const toggleMNCSItemEditable = async (Id) => {
    if (mncsSchedule.find((item) => item.Id === Id).isEditable) {
      const updatedMNCSItem = mncsSchedule.find((item) => item.Id === Id);
      const formattedMNCSItem = {
        Id: updatedMNCSItem.Id,
        ncs: updatedMNCSItem.ncs,
        months: updatedMNCSItem.months,
      };
      const response = await updateListItem("mncsschedule", formattedMNCSItem);
    }

    setMncsSchedule((prevSchedule) =>
      prevSchedule.map((item) =>
        item.Id === Id ? { ...item, isEditable: !item.isEditable } : item
      )
    );
  };

  const handleEditField = (Id, field, value) => {
    setError("");
    setBroadcastingSchedule((prevSchedule) =>
      prevSchedule.map((item) =>
        item.Id === Id ? { ...item, [field]: value } : item
      )
    );
    setMncsSchedule((prevSchedule) =>
      prevSchedule.map((item) =>
        item.Id === Id ? { ...item, [field]: value } : item
      )
    );
  };

  const clearError = () => {
    setError("");
  };

  useEffect(() => {
    fetchBroadcastingSchedule();
    fetchMNCSSchedule();
  }, []);

  return (
    <Box display="flex">
      <Box flexGrow="1" mr={2} display="flex" flexDir="column">
        <Text fontWeight="bold" fontSize="lg">
          Broadcasting NCS Schedule:
        </Text>
        <Table variant="msltable" rounded="sm">
          <Thead>
            <Tr>
              <Th>EDIT</Th>
              <Th>Time</Th>
              <Th>NCS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {broadcastingSchedule.map(
              ({ Id, time, ncs, isEditable = false }) => (
                <Tr key={Id}>
                  <Td>
                    <Link onClick={() => toggleBroadcastItemEditable(Id)}>
                      {isEditable ? <CheckIcon /> : <EditIcon />}
                    </Link>
                  </Td>
                  <Td>
                    {isEditable ? (
                      <Input
                        type="text"
                        onChange={(e) =>
                          handleEditField(Id, "time", e.target.value)
                        }
                        isInvalid={error.match("broadcast time")}
                        value={time}
                      />
                    ) : (
                      time
                    )}
                  </Td>
                  <Td>
                    {isEditable ? (
                      <Input
                        type="text"
                        onChange={(e) =>
                          handleEditField(Id, "ncs", e.target.value)
                        }
                        value={ncs}
                      />
                    ) : (
                      ncs
                    )}
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
        {error && error.match("broadcast") && (
          <Alert status="error" variant="solid">
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <CloseButton
              onClick={clearError}
              position="absolute"
              right="8px"
              top="8px"
            />
          </Alert>
        )}
      </Box>
      <Box flexGrow="1" ml={2} display="flex" flexDir="column">
        <Text fontWeight="bold" fontSize="lg">
          MNCS Schedule:
        </Text>
        <Table variant="msltable" rounded="sm">
          <Thead>
            <Tr>
              <Th>EDIT</Th>
              <Th>NCS</Th>
              <Th>MONTHS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mncsSchedule.map(({ Id, ncs, months, isEditable }) => (
              <Tr key={Id}>
                <Td>
                  <Link onClick={() => toggleMNCSItemEditable(Id)}>
                    {isEditable ? <CheckIcon /> : <EditIcon />}
                  </Link>
                </Td>
                <Td>
                  {isEditable ? (
                    <Input
                      type="text"
                      onChange={(e) =>
                        handleEditField(Id, "ncs", e.target.value)
                      }
                      value={ncs}
                    />
                  ) : (
                    ncs
                  )}
                </Td>
                <Td>
                  {isEditable ? (
                    <Input
                      type="text"
                      onChange={(e) =>
                        handleEditField(Id, "months", e.target.value)
                      }
                      value={months}
                    />
                  ) : (
                    months
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default MainSettings;
