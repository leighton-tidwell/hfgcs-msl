import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
  CloseButton,
  Stack,
  Grid,
  GridItem,
  Box,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Select, Input, Textarea } from "../";
import {
  getShiftPersonnel,
  getPersonnelStatus,
  getMNCSSchedule,
  updateListItem,
  getActionsForDate,
} from "../../api";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const BeginNuRaday = ({ shift, actionEntry, onSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [shiftMembers, setShiftMembers] = useState([]);
  const [status, setStatus] = useState([]);
  const [currentMncs, setCurrentMncs] = useState([]);
  const [previousStationStatus, setPreviousStationStatus] = useState("");
  const [formData, setFormData] = useState({
    category: "BEGIN NU RADAY",
    zuluDate: dayjs(actionEntry.zuluDate).format("YYYY-MM-DD"),
    time: dayjs(actionEntry.time, "HHmm").format("HHmm"),
    operatorInitials: actionEntry.operatorInitials,
    action: "",
  });
  const [error, setError] = useState(null);

  const fetchShiftMembers = async () => {
    const shiftMembers = await getShiftPersonnel(shift ? shift : "");
    setShiftMembers(shiftMembers);
  };

  const fetchStatus = async () => {
    const status = await getPersonnelStatus();
    setStatus(status);
  };

  const fetchMNCSSchedule = async () => {
    const mncsSchedule = await getMNCSSchedule();
    const currentMonth = dayjs().get("month") + 1;

    const ancsSchedule = mncsSchedule
      .find((mncs) => mncs.ncs === "ANCS")
      .months.split(",");

    const isAncsCurrent = ancsSchedule.indexOf(currentMonth.toString()) !== -1;
    setCurrentMncs(isAncsCurrent ? "ANCS" : "GFNCS");
  };

  const handleDataChange = (e) => {
    setError("");
    if (e.target.name === "time" && e.target.value.length <= 4) {
      return setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: e.target.value.replace(/[^0-9]/g, ""),
      }));
    }
    if (e.target.name === "time" && e.target.value.length > 4) return;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleShiftMemberChange = async (Id, e) => {
    setShiftMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member.Id === Id && e.target.name === "status") {
          member.status = e.target.value;
        }

        if (member.Id === Id && e.target.name === "nameAndRank") {
          member.rank = e.target.value.split("-")[0] || "";
          member.lastname = e.target.value.split("-")[1] || "";
          member.notOriginal = true;
        }

        return member;
      })
    );

    if (e.target.name === "status") {
      const updatedMember = shiftMembers.find((member) => member.Id === Id);
      if ("notOriginal" in updatedMember) return;

      const formattedUpdatedMember = {
        Id: updatedMember.Id,
        status: e.target.value,
      };

      await updateListItem("personnel", formattedUpdatedMember);
    }
  };

  const handleFetchPreviousStationStatus = async () => {
    const previousStationStatus = await getActionsForDate(
      dayjs().subtract(1, "day").format("MM/DD/YYYY")
    );
    const findPreviousStationStatus = previousStationStatus.find(
      (status) => status.eventcategory === "CHKLST NOTE - 108 (END)"
    );

    if (Array.isArray(findPreviousStationStatus)) {
      const sortByTime = findPreviousStationStatus.sort((a, b) =>
        a.entrytime > b.entrytime ? 1 : -1
      );
      setPreviousStationStatus(
        sortByTime[sortByTime.length - 1].action.split("ATT/")[1]
      );
      return;
    }

    setPreviousStationStatus(
      findPreviousStationStatus?.action?.split("ATT/")[1] || ""
    );
  };

  const handleMNCSChange = (e) => {
    setCurrentMncs(e.target.value);
  };

  const addPersonnel = () => {
    setShiftMembers((prevMembers) => [
      ...prevMembers,
      {
        Id: uuidv4(),
        notOriginal: true,
        status: "ON DUTY",
        rank: "",
        lastname: "",
      },
    ]);
  };

  const handleSave = async () => {
    setError("");
    const zuluTimeRegEx = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);
    const timeValidation = zuluTimeRegEx.test(formData.time);
    if (!timeValidation) return setError("You must enter a valid time.");
    if (!formData.zuluDate) return setError("You must enter a date.");
    if (!formData.operatorInitials)
      return setError("You must enter operator initials.");
    if (!formData.action) return setError("You must enter an action.");
    if (!formData.category) return setError("You must enter a category.");
    setLoading(true);

    const entryObj = {
      ...formData,
      zuluDate: dayjs(formData.zuluDate).format("MM/DD/YYYY"),
    };

    const note603 = {
      ...formData,
      category: "RADAY CHECKLIST - (START)",
      action: "(U) COORDINATORS HAVE STARTED THE RADAY CHECKLIST ATT//",
      zuluDate: dayjs(formData.zuluDate).format("MM/DD/YYYY"),
      time: dayjs(formData.time, "HHmm").add(1, "minute").format("HHmm"),
    };

    await onSubmit(entryObj);
    await onSubmit(note603);

    setFormData({
      ...formData,
      category: "BEGIN NU RAYDAY",
      zuluDate: dayjs().format("YYYY-MM-DD"),
      time: dayjs().format("HHmm"),
    });

    setLoading(false);
    onClose();
  };

  const clearError = () => {
    setError("");
    setLoading(false);
  };

  useEffect(() => {
    fetchShiftMembers();
    fetchStatus();
    fetchMNCSSchedule();
    handleFetchPreviousStationStatus();
  }, []);

  useEffect(() => {
    if (shiftMembers.length === 0) return;
    const findShiftLeadOnDuty = shiftMembers.find(
      (e) => e.status == "SHIFT LEAD"
    );
    const shiftLeadOnDuty = findShiftLeadOnDuty
      ? findShiftLeadOnDuty.rank + " " + findShiftLeadOnDuty.lastname
      : "RANK NAME";
    const shiftMembersOnDuty = shiftMembers
      .filter((e) => e.status === "ON DUTY")
      .map((m) => m.rank + " " + m.lastname)
      .join(", ");
    const otherShiftMembers = shiftMembers
      .filter((e) => e.status !== "ON DUTY" && e.status !== "SHIFT LEAD")
      .map((m) => m.rank + " " + m.lastname + ": " + m.status)
      .join(", ");

    setFormData((prevData) => ({
      ...prevData,
      action: `(S) ${shiftLeadOnDuty} & ${shift} ON DUTY ATT/ ${
        shiftMembersOnDuty ? shiftMembersOnDuty + "/" : ""
      } ${
        otherShiftMembers ? otherShiftMembers + "/" : ""
      } ${currentMncs} IS MNCS/ ${previousStationStatus}`,
    }));
  }, [shiftMembers, currentMncs, previousStationStatus]);

  useEffect(() => {
    setFormData({
      ...formData,
      zuluDate: dayjs(actionEntry.zuluDate).format("YYYY-MM-DD"),
      time: dayjs(actionEntry.time, "HHmm").format("HHmm"),
      operatorInitials: actionEntry.operatorInitials,
    });
  }, [actionEntry]);

  return (
    <>
      <Button onClick={onOpen} colorScheme="green">
        Form Builder
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW="50vw" bg="gray.900" color="white">
          <ModalHeader>BEGIN NU RADAY</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction="row" spacing={5}>
              <VStack flexGrow="1" spacing={4}>
                <FormControl id="event-category" isRequired>
                  <FormLabel>Event</FormLabel>
                  <Input
                    isDisabled
                    value={formData.category}
                    name="category"
                    type="text"
                  />
                </FormControl>
                <FormControl id="date" isRequired>
                  <FormLabel>Zulu Date</FormLabel>
                  <Input
                    onChange={handleDataChange}
                    value={formData.zuluDate}
                    name="zuluDate"
                    type="date"
                  />
                </FormControl>
                <FormControl id="time" isRequired>
                  <FormLabel>Time (Z)</FormLabel>
                  <Input
                    onChange={handleDataChange}
                    value={formData.time}
                    name="time"
                    type="text"
                  />
                </FormControl>
                <FormControl id="op-init" isRequired>
                  <FormLabel>Operator Initials</FormLabel>
                  <Select
                    value={formData.operatorInitials}
                    placeholder="Select an operator"
                    name="operatorInitials"
                    onChange={handleDataChange}
                  >
                    {shiftMembers
                      .filter((e) => e.initials)
                      .map((member) => (
                        <option key={member.Id} value={member.initials}>
                          {member.initials} | {member.lastname}
                        </option>
                      ))}
                  </Select>
                </FormControl>
                <FormControl id="mncs" isRequired>
                  <FormLabel>MNCS</FormLabel>
                  <Select
                    name="mncs"
                    onChange={handleMNCSChange}
                    value={currentMncs}
                  >
                    <option value="ANCS">ANCS</option>
                    <option value="GFNCS">GFNCS</option>
                  </Select>
                </FormControl>
                <FormControl id="action" isRequired>
                  <FormLabel>Action/Event</FormLabel>
                  <Textarea
                    onChange={handleDataChange}
                    name="action"
                    type="text"
                    value={formData.action}
                    minHeight="200px"
                  />
                </FormControl>
                {error && (
                  <Alert status="error" variant="solid">
                    <AlertIcon />
                    <AlertTitle mr={2}>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    <CloseButton
                      position="absolute"
                      onClick={clearError}
                      right="8px"
                      top="8px"
                    />
                  </Alert>
                )}
              </VStack>
              <VStack flexGrow="1" spacing={4}>
                <Box width="85%" display="flex" alignItems="center">
                  <Text flexGrow="1" fontWeight="bold">
                    Personnel
                  </Text>
                  <Button onClick={addPersonnel} size="sm" colorScheme="blue">
                    <AddIcon />
                  </Button>
                </Box>
                <Grid
                  templateColumns="125px 150px 150px"
                  gap={1}
                  alignItems="center"
                  mt={4}
                >
                  <GridItem>
                    <FormLabel>Current Shift</FormLabel>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Input isDisabled value={shift} type="text" />
                  </GridItem>
                  {shiftMembers.map((member, i) => (
                    <React.Fragment key={member.Id}>
                      <GridItem>
                        <FormLabel>Personnel {i + 1}</FormLabel>
                      </GridItem>
                      <GridItem>
                        <Input
                          name="nameAndRank"
                          onChange={(e) =>
                            handleShiftMemberChange(member.Id, e)
                          }
                          value={`${member.rank}-${member.lastname}`}
                        />
                      </GridItem>
                      <GridItem>
                        <Select
                          onChange={(e) =>
                            handleShiftMemberChange(member.Id, e)
                          }
                          name="status"
                          placeholder="Select a status"
                          value={member.status}
                        >
                          {status.map((stat) => (
                            <option key={stat.Id} value={stat.status}>
                              {stat.status}
                            </option>
                          ))}
                        </Select>
                      </GridItem>
                    </React.Fragment>
                  ))}
                </Grid>
              </VStack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={loading}
              colorScheme="red"
              variant="ghost"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button disabled={loading} colorScheme="blue" onClick={handleSave}>
              {loading ? <Spinner size="sm" /> : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BeginNuRaday;
