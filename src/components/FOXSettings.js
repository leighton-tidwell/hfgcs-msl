import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import {
  getRXMedians,
  getMSGOriginators,
  updateListItem,
  removeFromList,
  insertIntoList,
  getReportingCMD,
} from "../api";
import { EditIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { ConfirmModal, Input, AddSettingsModal, Select } from ".";

const FOXSettings = () => {
  const toast = useToast();
  const [rxMedians, setRxMedians] = useState([]);
  const [msgoriginators, setMsgoriginators] = useState([]);
  const [reportingCMDs, setReportingCMDs] = useState([]);

  const fetchRXMedians = async () => {
    try {
      const response = await getRXMedians("fox");
      const formReadyMedians = response?.map((item) => ({
        ...item,
        isEditable: false,
      }));

      setRxMedians(formReadyMedians);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const fetchMSGOriginators = async () => {
    try {
      const response = await getMSGOriginators("fox");
      const formReadyOriginators = response.map((item) => ({
        ...item,
        isEditable: false,
      }));

      setMsgoriginators(formReadyOriginators);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const fetchReportingCMDs = async () => {
    try {
      const response = await getReportingCMD();
      const formReadyCMD = response.map((item) => ({
        ...item,
        isEditable: false,
      }));

      setReportingCMDs(formReadyCMD);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleEditField = (Id, field, value) => {
    setRxMedians((prevMedians) =>
      prevMedians.map((median) =>
        median.Id === Id ? { ...median, [field]: value } : median
      )
    );

    setMsgoriginators((prevOriginators) =>
      prevOriginators.map((originator) =>
        originator.Id === Id ? { ...originator, [field]: value } : originator
      )
    );

    setReportingCMDs((prevCMDs) =>
      prevCMDs.map((cmd) => (cmd.Id === Id ? { ...cmd, [field]: value } : cmd))
    );
  };

  const toggleRXItemEditable = async (Id) => {
    try {
      const updatedMedianItem = rxMedians.find((median) => median.Id === Id);
      if (updatedMedianItem.isEditable) {
        const formattedMedianItem = {
          Id: updatedMedianItem.Id,
          name: updatedMedianItem.name,
          typediff: updatedMedianItem.typediff,
          default: updatedMedianItem.default,
        };
        const response = await updateListItem("rxmedian", formattedMedianItem);
      }
      setRxMedians((prevMedians) =>
        prevMedians.map((median) =>
          median.Id === Id
            ? { ...median, isEditable: !median.isEditable }
            : median
        )
      );
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleAddRxMedian = async (rxMedian) => {
    try {
      const formattedMedian = {
        ...rxMedian,
        typediff: "fox",
      };
      const response = await insertIntoList("rxmedian", formattedMedian);
      const newMedian = {
        ...rxMedian,
        default: "false",
        isEditable: false,
        Id: response,
      };
      setRxMedians((prevMedians) => [...prevMedians, newMedian]);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleSetDefaultRxMedian = async (name) => {
    try {
      const updatedRxMedian = rxMedians.find((median) => median.name === name);
      const formattedMedian = {
        Id: updatedRxMedian.Id,
        name: updatedRxMedian.name,
        typediff: updatedRxMedian.typediff,
        default: "true",
      };

      const formerDefaultMedian = rxMedians.find(
        (median) => median.default === "true"
      );
      const formattedFormerDefaultMedian = {
        Id: formerDefaultMedian?.Id,
        name: formerDefaultMedian?.name,
        typediff: formerDefaultMedian?.typediff,
        default: "false",
      };

      const response = await updateListItem("rxmedian", formattedMedian);
      if (formerDefaultMedian !== undefined)
        await updateListItem("rxmedian", formattedFormerDefaultMedian);

      setRxMedians((prevMedians) =>
        prevMedians.map((median) =>
          median.Id === updatedRxMedian.Id
            ? { ...median, default: "true" }
            : { ...median, default: "false" }
        )
      );
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDeleteRxMedian = async (Id) => {
    try {
      setRxMedians((prevMedians) =>
        prevMedians.filter((item) => item.Id !== Id)
      );
      const response = await removeFromList("rxmedian", Id);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const toggleMSGItemEditable = async (Id) => {
    try {
      const updatedOriginatorItem = msgoriginators.find(
        (originator) => originator.Id === Id
      );
      if (updatedOriginatorItem.isEditable) {
        const formattedOriginatorItem = {
          Id: updatedOriginatorItem.Id,
          name: updatedOriginatorItem.name,
          default: updatedOriginatorItem.default,
          typediff: updatedOriginatorItem.typediff,
        };
        const response = await updateListItem(
          "msgoriginator",
          formattedOriginatorItem
        );
      }
      setMsgoriginators((prevOriginators) =>
        prevOriginators.map((originator) =>
          originator.Id === Id
            ? { ...originator, isEditable: !originator.isEditable }
            : originator
        )
      );
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleAddMSGOriginator = async (msgOriginator) => {
    try {
      const formattedOriginator = {
        ...msgOriginator,
        typediff: "fox",
      };
      const newOriginator = {
        ...msgOriginator,
        default: "false",
        isEditable: false,
        Id: response,
      };
      setMsgoriginators((prevOriginators) => [
        ...prevOriginators,
        newOriginator,
      ]);
      const response = await insertIntoList(
        "msgoriginator",
        formattedOriginator
      );
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleSetDefaultMSGOriginator = async (name) => {
    try {
      const updatedMSGOriginator = msgoriginators.find(
        (originator) => originator.name === name
      );
      const formattedOriginator = {
        Id: updatedMSGOriginator.Id,
        name: updatedMSGOriginator.name,
        default: "true",
        typediff: updatedMSGOriginator.typediff,
      };

      const formerDefaultOriginator = msgoriginators.find(
        (originator) => originator.default === "true"
      );
      const formattedFormerDefaultOriginator = {
        Id: formerDefaultOriginator?.Id,
        name: formerDefaultOriginator?.name,
        default: "false",
        typediff: formerDefaultOriginator?.typediff,
      };

      const response = await updateListItem(
        "msgoriginator",
        formattedOriginator
      );
      if (formerDefaultOriginator !== undefined)
        await updateListItem("msgoriginator", formattedFormerDefaultOriginator);

      setMsgoriginators((prevOriginators) =>
        prevOriginators.map((originator) =>
          originator.Id === updatedMSGOriginator.Id
            ? { ...originator, default: "true" }
            : { ...originator, default: "false" }
        )
      );
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDeleteMSGOriginator = async (Id) => {
    try {
      setMsgoriginators((prevOriginators) =>
        prevOriginators.filter((item) => item.Id !== Id)
      );
      const response = await removeFromList("msgoriginator", Id);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleSetDefaultReportingCMD = async (name) => {
    try {
      const updatedReportingCMD = reportingCMDs.find(
        (reportingCMD) => reportingCMD.name === name
      );
      const formattedReportingCMD = {
        Id: updatedReportingCMD.Id,
        name: updatedReportingCMD.name,
        default: "true",
      };

      const formerDefaultReportingCMD = reportingCMDs.find(
        (reportingCMD) => reportingCMD.default === "true"
      );
      const formattedFormerDefaultReportingCMD = {
        Id: formerDefaultReportingCMD?.Id,
        name: formerDefaultReportingCMD?.name,
        default: "false",
      };

      const response = await updateListItem(
        "reportingcmd",
        formattedReportingCMD
      );
      if (formattedFormerDefaultReportingCMD !== undefined)
        await updateListItem(
          "reportingcmd",
          formattedFormerDefaultReportingCMD
        );

      setReportingCMDs((prevReportingCMDs) =>
        prevReportingCMDs.map((reportingCMD) =>
          reportingCMD.Id === updatedReportingCMD.Id
            ? { ...reportingCMD, default: "true" }
            : { ...reportingCMD, default: "false" }
        )
      );
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const toggleReportingCMDItemEditable = async (Id) => {
    try {
      const updatedReportingCMDItem = reportingCMDs.find(
        (reportingCMD) => reportingCMD.Id === Id
      );
      if (updatedReportingCMDItem.isEditable) {
        const formattedReportingCMDItem = {
          Id: updatedReportingCMDItem.Id,
          name: updatedReportingCMDItem.name,
          default: updatedReportingCMDItem.default,
        };
        const response = await updateListItem(
          "reportingcmd",
          formattedReportingCMDItem
        );
      }
      setReportingCMDs((prevReportingCMDs) =>
        prevReportingCMDs.map((reportingCMD) =>
          reportingCMD.Id === Id
            ? { ...reportingCMD, isEditable: !reportingCMD.isEditable }
            : reportingCMD
        )
      );
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleAddReportingCMD = async (reportingCMD) => {
    try {
      const response = await insertIntoList("reportingcmd", reportingCMD);
      const newReportingCMD = {
        ...reportingCMD,
        default: "false",
        isEditable: false,
        Id: response,
      };
      setReportingCMDs((prevReportingCMDs) => [
        ...prevReportingCMDs,
        newReportingCMD,
      ]);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDeleteReportingCMD = async (Id) => {
    try {
      setReportingCMDs((prevReportingCMDs) =>
        prevReportingCMDs.filter((item) => item.Id !== Id)
      );
      const response = await removeFromList("reportingcmd", Id);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const addRXMedianParams = {
    name: "RX Median",
    fields: [
      {
        id: "rxNameInput",
        name: "Name",
        databaseName: "name",
        type: "text",
      },
    ],
    onSubmit: handleAddRxMedian,
  };

  const addMSGOriginatorParams = {
    name: "MSG Originator",
    fields: [
      {
        id: "msgNameInput",
        name: "Name",
        databaseName: "name",
        type: "text",
      },
    ],
    onSubmit: handleAddMSGOriginator,
  };

  const addReportingCMDParams = {
    name: "Reporting CMD",
    fields: [
      {
        id: "cmdNameInput",
        name: "Name",
        databaseName: "name",
        type: "text",
      },
    ],
    onSubmit: handleAddReportingCMD,
  };

  const loadSettings = async () => {
    await Promise.all([
      await fetchMSGOriginators(),
      await fetchRXMedians(),
      await fetchReportingCMDs(),
    ]);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <Box display="flex">
      <Box mr={2} flexGrow="1">
        <Box mb={3} display="flex" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" flexGrow="1">
            RX Medians:
          </Text>
          <Box mr={2}>
            <AddSettingsModal parameters={addRXMedianParams} />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Text mr={2}>Default: </Text>
          <Select
            value={rxMedians.find((median) => median.default === "true")?.name}
            onChange={(e) => handleSetDefaultRxMedian(e.target.value)}
          >
            {rxMedians.map((median) => (
              <option key={median.Id + "select"} value={median.name}>
                {median.name}
              </option>
            ))}
          </Select>
        </Box>
        <Box
          maxHeight="450px"
          overflowY="auto"
          overflowX="hidden"
          css={{
            "&::-webkit-scrollbar": {
              width: "12px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#2d3748",
              borderRadius: "10px",
              border: "2px solid #1a202c",
            },
          }}
        >
          <Table variant="msltable" rounded="sm">
            <Thead position="sticky" top="0">
              <Tr>
                <Th position="sticky">EDIT</Th>
                <Th position="sticky">Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!rxMedians.length && (
                <Tr>
                  <Td textAlign="center" colSpan="2">
                    <Spinner />
                  </Td>
                </Tr>
              )}
              {rxMedians.map((median) => (
                <Tr key={median.Id}>
                  <Td>
                    <Link onClick={() => toggleRXItemEditable(median.Id)}>
                      {median.isEditable ? <CheckIcon /> : <EditIcon />}
                    </Link>
                    <ConfirmModal
                      ml={2}
                      onConfirm={() => handleDeleteRxMedian(median.Id)}
                      Icon={<DeleteIcon />}
                      message="Are you sure you want to delete this median?"
                    />
                  </Td>
                  <Td>
                    {median.isEditable ? (
                      <Input
                        value={median.name}
                        onChange={(e) =>
                          handleEditField(median.Id, "name", e.target.value)
                        }
                      />
                    ) : (
                      median.name
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      <Box ml={2} mr={2} flexGrow="1">
        <Box mb={3} display="flex" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" flexGrow="1">
            MSG Originators:
          </Text>
          <Box mr={2}>
            <AddSettingsModal parameters={addMSGOriginatorParams} />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Text mr={2}>Default: </Text>
          <Select
            value={
              msgoriginators.find((originator) => originator.default === "true")
                ?.name
            }
            onChange={(e) => handleSetDefaultMSGOriginator(e.target.value)}
          >
            {msgoriginators.map((originator) => (
              <option key={originator.Id + "select"} value={originator.name}>
                {originator.name}
              </option>
            ))}
          </Select>
        </Box>
        <Box
          maxHeight="450px"
          overflowY="auto"
          overflowX="hidden"
          css={{
            "&::-webkit-scrollbar": {
              width: "12px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#2d3748",
              borderRadius: "10px",
              border: "2px solid #1a202c",
            },
          }}
        >
          <Table variant="msltable" rounded="sm">
            <Thead position="sticky" top="0">
              <Tr>
                <Th position="sticky">EDIT</Th>
                <Th position="sticky">Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!msgoriginators.length && (
                <Tr>
                  <Td textAlign="center" colSpan="2">
                    <Spinner />
                  </Td>
                </Tr>
              )}
              {msgoriginators.map((originator) => (
                <Tr key={originator.Id}>
                  <Td>
                    <Link onClick={() => toggleMSGItemEditable(originator.Id)}>
                      {originator.isEditable ? <CheckIcon /> : <EditIcon />}
                    </Link>
                    <ConfirmModal
                      ml={2}
                      onConfirm={() => handleDeleteMSGOriginator(originator.Id)}
                      Icon={<DeleteIcon />}
                      message="Are you sure you want to delete this originator?"
                    />
                  </Td>
                  <Td>
                    {originator.isEditable ? (
                      <Input
                        value={originator.name}
                        onChange={(e) =>
                          handleEditField(originator.Id, "name", e.target.value)
                        }
                      />
                    ) : (
                      originator.name
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      <Box ml={2} flexGrow="1">
        <Box mb={3} display="flex" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" flexGrow="1">
            Reporting CMD:
          </Text>
          <Box mr={2}>
            <AddSettingsModal parameters={addReportingCMDParams} />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Text mr={2}>Default: </Text>
          <Select
            value={reportingCMDs.find((cmd) => cmd.default === "true")?.name}
            onChange={(e) => handleSetDefaultReportingCMD(e.target.value)}
          >
            {reportingCMDs.map((cmd) => (
              <option key={cmd.Id + "select"} value={cmd.name}>
                {cmd.name}
              </option>
            ))}
          </Select>
        </Box>
        <Box
          maxHeight="450px"
          overflowY="auto"
          overflowX="hidden"
          css={{
            "&::-webkit-scrollbar": {
              width: "12px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#2d3748",
              borderRadius: "10px",
              border: "2px solid #1a202c",
            },
          }}
        >
          <Table variant="msltable" rounded="sm">
            <Thead position="sticky" top="0">
              <Tr>
                <Th position="sticky">EDIT</Th>
                <Th position="sticky">Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!reportingCMDs.length && (
                <Tr>
                  <Td textAlign="center" colSpan="2">
                    <Spinner />
                  </Td>
                </Tr>
              )}
              {reportingCMDs.map((cmd) => (
                <Tr key={cmd.Id}>
                  <Td>
                    <Link
                      onClick={() => toggleReportingCMDItemEditable(cmd.Id)}
                    >
                      {cmd.isEditable ? <CheckIcon /> : <EditIcon />}
                    </Link>
                    <ConfirmModal
                      ml={2}
                      onConfirm={() => handleDeleteReportingCMD(cmd.Id)}
                      Icon={<DeleteIcon />}
                      message="Are you sure you want to delete this reporting command?"
                    />
                  </Td>
                  <Td>
                    {cmd.isEditable ? (
                      <Input
                        value={cmd.name}
                        onChange={(e) =>
                          handleEditField(cmd.Id, "name", e.target.value)
                        }
                      />
                    ) : (
                      cmd.name
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

export default FOXSettings;
