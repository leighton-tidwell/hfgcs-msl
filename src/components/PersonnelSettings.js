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
  Checkbox,
  Spinner,
} from "@chakra-ui/react";
import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  EditIcon,
  Input,
  Select,
  RankSelect,
  AddSettingsModal,
  ConfirmModal,
} from ".";
import {
  getShifts,
  getShiftPersonnel,
  getPersonnelStatus,
  updateListItem,
  insertIntoList,
  removeFromList,
} from "../api";

const PersonnelSettings = () => {
  const [shifts, setShifts] = useState([]);
  const [shiftPersonnel, setShiftPersonnel] = useState([]);
  const [status, setStatus] = useState([]);

  const fetchShifts = async () => {
    const response = await getShifts();
    const formReadyShifts = response.map((item) => ({
      ...item,
      isEditable: false,
    }));
    setShifts(formReadyShifts);
  };

  const toggleShiftItemEditable = async (Id) => {
    const changedItem = shifts.find((item) => item.Id === Id);

    if (changedItem.isEditable) {
      const formattedShiftItem = {
        Id: changedItem.Id,
        name: changedItem.name,
        isDayShift: changedItem.isDayShift,
      };
      const response = await updateListItem("shift", formattedShiftItem);
    }

    setShifts((prevShifts) =>
      prevShifts.map((item) =>
        item.Id === Id ? { ...item, isEditable: !item.isEditable } : item
      )
    );
  };

  const toggleShiftPersonnelItemEditable = async (Id) => {
    const changedItem = shiftPersonnel.find((item) => item.Id === Id);

    if (changedItem.isEditable) {
      const formattedShiftPersonnelItem = {
        Id: changedItem.Id,
        rank: changedItem.rank,
        lastname: changedItem.lastname,
        initials: changedItem.initials,
        isShiftLead: changedItem.isShiftLead,
        status: changedItem.status,
      };
      const response = await updateListItem(
        "personnel",
        formattedShiftPersonnelItem
      );
    }

    setShiftPersonnel((prevShiftPersonnel) =>
      prevShiftPersonnel.map((item) =>
        item.Id === Id ? { ...item, isEditable: !item.isEditable } : item
      )
    );
  };

  const toggleStatusItemEditable = async (Id) => {
    const changedItem = status.find((item) => item.Id === Id);

    if (changedItem.isEditable) {
      const formattedStatusItem = {
        Id: changedItem.Id,
        status: changedItem.status,
      };
      const response = await updateListItem(
        "personnelstatus",
        formattedStatusItem
      );
    }

    setStatus((prevStatus) =>
      prevStatus.map((item) =>
        item.Id === Id ? { ...item, isEditable: !item.isEditable } : item
      )
    );
  };

  const fetchPersonnel = async () => {
    const response = await getShiftPersonnel();
    const formReadyPersonnel = response.map((item) => ({
      ...item,
      isEditable: false,
    }));
    setShiftPersonnel(formReadyPersonnel);
  };

  const fetchStatus = async () => {
    const response = await getPersonnelStatus();
    const formReadyStatus = response.map((item) => ({
      ...item,
      isEditable: false,
    }));
    setStatus(formReadyStatus);
  };

  const handleEditField = (Id, field, value) => {
    setShifts((prevShifts) =>
      prevShifts.map((item) =>
        item.Id === Id ? { ...item, [field]: value } : item
      )
    );

    setShiftPersonnel((prevPersonnel) =>
      prevPersonnel.map((item) =>
        item.Id === Id ? { ...item, [field]: value } : item
      )
    );

    setStatus((prevStatus) =>
      prevStatus.map((item) =>
        item.Id === Id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddShift = async (shift) => {
    const formattedShift = {
      ...shift,
      isDayShift: shift.isDayShift === "Yes" ? "true" : "false",
    };
    const response = await insertIntoList("shift", shift);
    const newShift = {
      ...formattedShift,
      isEditable: false,
      Id: response,
    };
    setShifts((prevShifts) => [...prevShifts, newShift]);
  };

  const handleDeleteShift = async (Id) => {
    const response = await removeFromList("shift", Id);
    setShifts((prevShifts) => prevShifts.filter((item) => item.Id !== Id));
  };

  const handleAddPersonnel = async (personnel) => {
    const formattedPersonnel = {
      ...personnel,
      isShiftLead: personnel.isShiftLead === "Yes" ? "true" : "false",
    };
    const response = await insertIntoList("personnel", formattedPersonnel);
    const newPersonnel = {
      ...formattedPersonnel,
      isEditable: false,
      Id: response,
    };

    setShiftPersonnel((prevPersonnel) => [...prevPersonnel, newPersonnel]);
  };

  const handleDeletePersonnel = async (Id) => {
    const response = await removeFromList("personnel", Id);
    setShiftPersonnel((prevPersonnel) =>
      prevPersonnel.filter((item) => item.Id !== Id)
    );
  };

  const handleAddStatus = async (status) => {
    const response = await insertIntoList("personnelstatus", status);
    const newStatus = {
      ...status,
      isEditable: false,
      Id: response,
    };
    setStatus((prevStatus) => [...prevStatus, newStatus]);
  };

  const handleDeleteStatus = async (Id) => {
    const response = await removeFromList("personnelstatus", Id);
    setStatus((prevStatus) => prevStatus.filter((item) => item.Id !== Id));
  };

  useEffect(() => {
    fetchShifts();
    fetchPersonnel();
    fetchStatus();
  }, []);

  const addShiftParams = {
    name: "Shift",
    fields: [
      {
        id: "shiftNameInput",
        name: "Name",
        databaseName: "name",
        type: "text",
      },
      {
        id: "shiftIsDayShiftCheckBox",
        name: "Day Shift?",
        databaseName: "isDayShift",
        type: "radio",
        default: "No",
        values: ["Yes", "No"],
      },
    ],
    onSubmit: handleAddShift,
  };

  const addPersonnelParams = {
    name: "Personnel",
    fields: [
      {
        id: "personnelShiftSelect",
        name: "Shift",
        databaseName: "shiftname",
        type: "select",
        options: shifts,
        placeholder: "Select a shift",
      },
      {
        id: "personnelRankSelect",
        name: "Rank",
        databaseName: "rank",
        type: "rankSelect",
      },
      {
        id: "personnelLastnameInput",
        name: "Last Name",
        databaseName: "lastname",
        type: "text",
      },
      {
        id: "personnelInitialsInput",
        name: "Initials",
        databaseName: "initials",
        type: "text",
      },
      {
        id: "personnelIsShiftLeadCheckBox",
        name: "Shift Lead?",
        databaseName: "isShiftLead",
        type: "radio",
        default: "No",
        values: ["Yes", "No"],
      },
    ],
    onSubmit: handleAddPersonnel,
  };

  const addStatusParams = {
    name: "Status",
    fields: [
      {
        id: "statusStatusInput",
        name: "Status",
        databaseName: "status",
        type: "text",
      },
    ],
    onSubmit: handleAddStatus,
  };

  return (
    <Box display="flex">
      <Box flexGrow="1" mr={2} display="flex" flexDir="column">
        <Box mb={3} display="flex" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" flexGrow="1">
            Shifts:
          </Text>
          <Box mr={2}>
            <AddSettingsModal parameters={addShiftParams} />
          </Box>
        </Box>
        <Box maxHeight="500px" overflowY="auto">
          <Table variant="msltable" rounded="sm">
            <Thead position="sticky" top="0">
              <Tr>
                <Th position="sticky">EDIT</Th>
                <Th position="sticky">Name</Th>
                <Th position="sticky">Day Staff</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!shifts.length && (
                <Tr>
                  <Td textAlign="center" colSpan="3">
                    <Spinner />
                  </Td>
                </Tr>
              )}
              {shifts.map((shift) => (
                <Tr key={shift.Id}>
                  <Td minWidth="100px">
                    <Link onClick={() => toggleShiftItemEditable(shift.Id)}>
                      {shift.isEditable ? <CheckIcon /> : <EditIcon />}
                    </Link>
                    <ConfirmModal
                      ml={2}
                      onConfirm={() => handleDeleteShift(shift.Id)}
                      Icon={<DeleteIcon />}
                      message="Are you sure you want to delete this shift?"
                    />
                  </Td>
                  <Td>
                    {shift.isEditable ? (
                      <Input
                        type="text"
                        value={shift.name}
                        onChange={(e) =>
                          handleEditField(shift.Id, "name", e.target.value)
                        }
                      />
                    ) : (
                      shift.name
                    )}
                  </Td>
                  <Td>
                    {shift.isEditable ? (
                      <Checkbox
                        defaultIsChecked={
                          shift.isDayShift === "true" ? true : false
                        }
                        value={shift.isDayShift === "true" ? "false" : "true"}
                        onChange={(e) =>
                          handleEditField(
                            shift.Id,
                            "isDayShift",
                            e.target.value
                          )
                        }
                      />
                    ) : shift.isDayShift === "true" ? (
                      <Checkbox defaultIsChecked isDisabled />
                    ) : (
                      <Checkbox isDisabled />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      <Box flexGrow="1" mr={2} display="flex" flexDir="column">
        <Box mb={3} display="flex" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" flexGrow="1">
            Personnel:
          </Text>
          <Box mr={2}>
            <AddSettingsModal parameters={addPersonnelParams} />
          </Box>
        </Box>
        <Box maxHeight="500px" overflowY="auto">
          <Table variant="msltable" rounded="sm">
            <Thead position="sticky" top="0">
              <Tr>
                <Th position="sticky">EDIT</Th>
                <Th position="sticky">Shift</Th>
                <Th position="sticky">Rank</Th>
                <Th position="sticky">Last Name</Th>
                <Th position="sticky">Init</Th>
                <Th position="sticky">Lead</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!shiftPersonnel.length && (
                <Tr>
                  <Td textAlign="center" colSpan="6">
                    <Spinner />
                  </Td>
                </Tr>
              )}
              {shiftPersonnel.map((personnel) => (
                <Tr key={personnel.Id}>
                  <Td minWidth="100px">
                    <Link
                      onClick={() =>
                        toggleShiftPersonnelItemEditable(personnel.Id)
                      }
                    >
                      {personnel.isEditable ? <CheckIcon /> : <EditIcon />}
                    </Link>
                    <ConfirmModal
                      ml={2}
                      onConfirm={() => handleDeletePersonnel(personnel.Id)}
                      Icon={<DeleteIcon />}
                      message="Are you sure you want to delete this personnel?"
                    />
                  </Td>
                  <Td>
                    {personnel.isEditable ? (
                      <Select
                        value={personnel.shiftname}
                        onChange={(e) =>
                          handleEditField(
                            personnel.Id,
                            "shiftname",
                            e.target.value
                          )
                        }
                      >
                        {shifts.map((shift) => (
                          <option value={shift.name}>{shift.name}</option>
                        ))}
                      </Select>
                    ) : (
                      personnel.shiftname
                    )}
                  </Td>
                  <Td>
                    {personnel.isEditable ? (
                      <RankSelect
                        onChange={(e) =>
                          handleEditField(personnel.Id, "rank", e.target.value)
                        }
                        value={personnel.rank}
                      />
                    ) : (
                      personnel.rank
                    )}
                  </Td>
                  <Td>
                    {personnel.isEditable ? (
                      <Input
                        type="text"
                        onChange={(e) =>
                          handleEditField(
                            personnel.Id,
                            "lastname",
                            e.target.value
                          )
                        }
                        value={personnel.lastname}
                      />
                    ) : (
                      personnel.lastname
                    )}
                  </Td>
                  <Td>
                    {personnel.isEditable ? (
                      <Input
                        type="text"
                        onChange={(e) =>
                          handleEditField(
                            personnel.Id,
                            "initials",
                            e.target.value
                          )
                        }
                        value={personnel.initials}
                      />
                    ) : (
                      personnel.initials
                    )}
                  </Td>
                  <Td>
                    {personnel.isEditable ? (
                      <Checkbox
                        defaultIsChecked={
                          personnel.isShiftLead === "true" ? true : false
                        }
                        onChange={(e) =>
                          handleEditField(
                            personnel.Id,
                            "isShiftLead",
                            e.target.value
                          )
                        }
                        value={
                          personnel.isShiftLead === "true" ? "false" : "true"
                        }
                      />
                    ) : personnel.isShiftLead === "true" ? (
                      <Checkbox defaultIsChecked isDisabled />
                    ) : (
                      <Checkbox isDisabled />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      <Box flexGrow="1" mr={2} display="flex" flexDir="column">
        <Box mb={3} display="flex" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" flexGrow="1">
            Status:
          </Text>
          <Box mr={2}>
            <AddSettingsModal parameters={addStatusParams} />
          </Box>
        </Box>
        <Box maxHeight="500px" overflowY="auto">
          <Table variant="msltable" rounded="sm">
            <Thead position="sticky" top="0">
              <Tr>
                <Th position="sticky">EDIT</Th>
                <Th position="sticky">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!status.length && (
                <Tr>
                  <Td textAlign="center" colSpan="2">
                    <Spinner />
                  </Td>
                </Tr>
              )}
              {status.map((status) => (
                <Tr key={status.Id}>
                  <Td minWidth="100px">
                    <Link onClick={() => toggleStatusItemEditable(status.Id)}>
                      {status.isEditable ? <CheckIcon /> : <EditIcon />}
                    </Link>
                    <ConfirmModal
                      ml={2}
                      onConfirm={() => handleDeleteStatus(status.Id)}
                      Icon={<DeleteIcon />}
                      message="Are you sure you want to delete this status?"
                    />
                  </Td>
                  <Td>
                    {status.isEditable ? (
                      <Input
                        type="text"
                        onChange={(e) =>
                          handleEditField(status.Id, "status", e.target.value)
                        }
                        value={status.status}
                      />
                    ) : (
                      status.status
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

export default PersonnelSettings;
