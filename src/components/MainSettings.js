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
  Spinner,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { EditIcon, Input, Select } from ".";
import {
  getBroadcastingSchedule,
  getMNCSSchedule,
  updateListItem,
  getStations,
} from "../api";

const MainSettings = () => {
  const [broadcastingSchedule, setBroadcastingSchedule] = useState([]);
  const [mncsSchedule, setMncsSchedule] = useState([]);
  const [stations, setStations] = useState([]);
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

  const fetchStations = async () => {
    const response = await getStations();
    const formReadyStations = response.map((item) => ({
      ...item,
      isEditable: false,
    }));

    setStations(formReadyStations);
  };

  const toggleBroadcastItemEditable = async (Id) => {
    const updatedBroadcastItem = broadcastingSchedule.find(
      (item) => item.Id === Id
    );

    if (updatedBroadcastItem.isEditable) {
      const zuluTimeRegEx = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);
      const timeValidation = zuluTimeRegEx.test(updatedBroadcastItem.time);
      if (!timeValidation)
        return setError("You must enter a valid broadcast time.");

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

  const toggleStationItemEditable = async (Id) => {
    if (stations.find((item) => item.Id === Id).isEditable) {
      const updatedStationItem = stations.find((item) => item.Id === Id);
      const formattedStationItem = {
        Id: updatedStationItem.Id,
        station: updatedStationItem.station,
        name: updatedStationItem.name,
        ncs: updatedStationItem.ncs,
      };
      const response = await updateListItem("stations", formattedStationItem);
    }

    setStations((prevStations) =>
      prevStations.map((item) =>
        item.Id === Id ? { ...item, isEditable: !item.isEditable } : item
      )
    );
  };

  const handleEditField = (Id, field, value, type) => {
    setError("");
    if (type === "broadcast")
      setBroadcastingSchedule((prevSchedule) =>
        prevSchedule.map((item) =>
          item.Id === Id ? { ...item, [field]: value } : item
        )
      );
    if (type === "mncs")
      setMncsSchedule((prevSchedule) =>
        prevSchedule.map((item) =>
          item.Id === Id ? { ...item, [field]: value } : item
        )
      );
    if (type === "station")
      setStations((prevStations) =>
        prevStations.map((item) =>
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
    fetchStations();
  }, []);

  return (
    <Box display="flex">
      <Box flexGrow="1" mr={2} display="flex" flexDir="column">
        <Box mb={3} display="flex" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" flexGrow="1">
            Broadcasting NCS Schedule:
          </Text>
        </Box>
        <Table variant="msltable" rounded="sm">
          <Thead>
            <Tr>
              <Th>EDIT</Th>
              <Th>Time</Th>
              <Th>NCS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!broadcastingSchedule.length && (
              <Tr>
                <Td textAlign="center" colSpan="3">
                  <Spinner />
                </Td>
              </Tr>
            )}
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
                          handleEditField(
                            Id,
                            "time",
                            e.target.value,
                            "broadcast"
                          )
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
                          handleEditField(
                            Id,
                            "ncs",
                            e.target.value,
                            "broadcast"
                          )
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
        <Box mb={3} display="flex" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" flexGrow="1">
            MNCS Schedule:
          </Text>
        </Box>
        <Table variant="msltable" rounded="sm">
          <Thead>
            <Tr>
              <Th>EDIT</Th>
              <Th>NCS</Th>
              <Th>MONTHS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!mncsSchedule.length && (
              <Tr>
                <Td textAlign="center" colSpan="3">
                  <Spinner />
                </Td>
              </Tr>
            )}
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
                        handleEditField(Id, "ncs", e.target.value, "mncs")
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
                        handleEditField(Id, "months", e.target.value, "mncs")
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
      <Box flexGrow="1" ml={2} display="flex" flexDir="column">
        <Box mb={3} display="flex" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" flexGrow="1">
            Stations:
          </Text>
        </Box>
        <Box maxHeight="500px" overflowY="auto">
          <Table variant="msltable" rounded="sm">
            <Thead position="sticky" top="0">
              <Tr>
                <Th position="sticky">EDIT</Th>
                <Th position="sticky">STN</Th>
                <Th position="sticky">NAME</Th>
                <Th position="sticky">NCS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!stations.length && (
                <Tr>
                  <Td textAlign="center" colSpan="4">
                    <Spinner />
                  </Td>
                </Tr>
              )}
              {stations.map(({ Id, station, name, ncs, isEditable }) => (
                <Tr key={Id + "3"}>
                  <Td>
                    <Link onClick={() => toggleStationItemEditable(Id)}>
                      {isEditable ? <CheckIcon /> : <EditIcon />}
                    </Link>
                  </Td>
                  <Td>
                    {isEditable ? (
                      <Input
                        type="text"
                        onChange={(e) =>
                          handleEditField(
                            Id,
                            "station",
                            e.target.value,
                            "station"
                          )
                        }
                        value={station}
                      />
                    ) : (
                      station
                    )}
                  </Td>
                  <Td>
                    {isEditable ? (
                      <Input
                        type="text"
                        onChange={(e) =>
                          handleEditField(Id, "name", e.target.value, "station")
                        }
                        value={name}
                      />
                    ) : (
                      name
                    )}
                  </Td>
                  <Td>
                    {isEditable ? (
                      <Select
                        value={ncs}
                        onChange={(e) =>
                          handleEditField(Id, "ncs", e.target.value, "station")
                        }
                      >
                        <option value="ANCS">ANCS</option>
                        <option value="GFNCS">GFNCS</option>
                      </Select>
                    ) : (
                      ncs
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default MainSettings;
