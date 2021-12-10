import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { Select, Input, Textarea, RankSelect } from "../";
import { getShiftPersonnel } from "../../api";
import dayjs from "dayjs";

const ShiftChangeOffDuty = ({ shift, actionEntry, onSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState("");

  const [shiftMembers, setShiftMembers] = useState([]);
  const [formData, setFormData] = useState({
    category: "SHIFT CHANGE",
    zuluDate: dayjs().format("YYYY-MM-DD"),
    time: dayjs().format("HHmm"),
    operatorInitials: actionEntry.operatorInitials,
    shiftLeadRank: "",
    action: "",
  });

  const fetchShiftMembers = async () => {
    const shiftMembers = await getShiftPersonnel(shift ? shift : "");
    setShiftMembers(shiftMembers);
  };

  const handleDataChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setError("");
    const zuluTimeRegEx = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);
    const timeValidation = zuluTimeRegEx.test(formData.time);
    if (!timeValidation) return setError("You must enter a valid time.");
    if (!formData.zuluDate) return setError("You must enter a date.");
    if (!formData.operatorInitials)
      return setError("You must enter operator initials.");
    if (!formData.action) return setError("You must enter an action.");
    if (!formData.category) return setError("You must enter a category.");

    const entryObj = {
      ...formData,
      zuluDate: dayjs(formData.zuluDate).format("MM/DD/YYYY"),
    };

    setFormData({
      ...formData,
      category: "SHIFT CHANGE",
      zuluDate: dayjs().format("YYYY-MM-DD"),
      time: dayjs().format("HHmm"),
      action: "",
    });

    onSubmit(entryObj);
    onClose();
  };

  const clearError = () => {
    setError("");
  };

  useEffect(() => {
    fetchShiftMembers();
  }, []);

  useEffect(() => {
    if (!shiftMembers.length) return;

    const shiftLeadRank = shiftMembers.find(
      (member) => member.isShiftLead === "true"
    ).rank;

    setFormData((prevData) => ({
      ...prevData,
      shiftLeadRank,
    }));
  }, [shiftMembers]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      action: `(U) ${formData.shiftLeadRank} __________________________ & ${shift} SHIFT OFF DUTY ATT//`,
    }));
  }, [
    formData.zuluDate,
    formData.time,
    formData.shiftLeadRank,
    formData.operatorInitials,
  ]);

  return (
    <>
      <Button onClick={onOpen} colorScheme="green">
        Form Builder
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white">
          <ModalHeader>SHIFT CHANGE (OFF DUTY)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
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
                  {shiftMembers.map((member) => (
                    <option key={member.Id} value={member.initials}>
                      {member.initials} | {member.lastname}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id="shift-lead-rank" isRequired>
                <FormLabel>Shift Lead Rank</FormLabel>
                <RankSelect
                  onChange={handleDataChange}
                  name="shiftLeadRank"
                  value={formData.shiftLeadRank}
                />
              </FormControl>
              <FormControl id="action" isRequired>
                <FormLabel>Action/Event</FormLabel>
                <Textarea
                  onChange={handleDataChange}
                  name="action"
                  type="text"
                  value={formData.action}
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
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShiftChangeOffDuty;
