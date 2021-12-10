import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
  Button,
  FormControl,
  FormLabel,
  VStack,
  CloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { Input, Select, Textarea } from ".";
import { EditIcon } from ".";
import { getAction } from "../api";
import dayjs from "dayjs";

const EditEntryModal = ({ entryID, updateEntry, removeEntry }) => {
  const [error, setError] = useState("");
  const [entry, setEntry] = useState({
    Id: "",
    eventcategory: "",
    entrydate: "",
    entrytime: "",
    operatorinitials: "",
    action: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchEntryDetails = async () => {
    const response = await getAction(entryID);
    if (!response.length) return;
    const newEntry = {
      ...response[0],
      entrydate: dayjs(response[0].entrydate).format("YYYY-MM-DD"),
    };
    setEntry(newEntry);
  };

  const handleCategoryChange = (e) => {
    setError("");
    setEntry((prevEntry) => ({
      ...prevEntry,
      eventcategory: e.target.value,
    }));
  };

  const handleDateChange = (e) => {
    setError("");
    setEntry((prevEntry) => ({
      ...prevEntry,
      entrydate: e.target.value,
    }));
  };

  const handleTimeChange = (e) => {
    setError("");
    if (e.target.value.length <= 4)
      setEntry((prevEntry) => ({
        ...prevEntry,
        entrytime: e.target.value,
      }));
  };

  const handleOperatorInitialsChange = (e) => {
    setError("");
    setEntry((prevEntry) => ({
      ...prevEntry,
      operatorinitials: e.target.value,
    }));
  };

  const handleActionChange = (e) => {
    setError("");
    setEntry((prevEntry) => ({ ...prevEntry, action: e.target.value }));
  };

  const clearError = () => {
    setError("");
  };

  const handleSave = () => {
    setError("");
    const zuluTimeRegEx = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);
    const timeValidation = zuluTimeRegEx.test(entry.entrytime);
    if (!timeValidation) return setError("You must enter a valid time.");
    if (!entry.entrydate) return setError("You must enter a date.");
    if (!entry.operatorinitials)
      return setError("You must enter operator initials.");
    if (!entry.action) return setError("You must enter an action.");
    if (!entry.eventcategory) return setError("You must enter a category.");

    const entryObj = {
      action: entry.action,
      operatorinitials: entry.operatorinitials,
      Id: entry.Id,
      eventcategory: entry.eventcategory,
      entrytime: entry.entrytime,
      entrydate: dayjs(entry.entrydate).format("MM/DD/YYYY"),
    };

    console.log(entryObj);

    updateEntry(entryObj);
    onClose();
  };

  const handleDelete = () => {
    removeEntry(entry.Id);
    onClose();
  };

  useEffect(() => {
    fetchEntryDetails();
  }, []);

  return (
    <>
      <Link onClick={onOpen}>
        <EditIcon />
      </Link>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white">
          <ModalHeader>Edit Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl id="event-category" isRequired>
                <FormLabel>Event Category</FormLabel>
                <Input
                  onChange={handleCategoryChange}
                  value={entry.eventcategory}
                />
              </FormControl>
              <FormControl id="date" isRequired>
                <FormLabel>Zulu Date</FormLabel>
                <Input
                  onChange={handleDateChange}
                  value={entry.entrydate}
                  type="date"
                />
              </FormControl>
              <FormControl id="time" isRequired>
                <FormLabel>Time (Z)</FormLabel>
                <Input
                  onChange={handleTimeChange}
                  value={entry.entrytime}
                  type="text"
                />
              </FormControl>
              <FormControl id="op-init" isRequired>
                <FormLabel>Operator Initials</FormLabel>
                <Input
                  onChange={handleOperatorInitialsChange}
                  value={entry.operatorinitials}
                  type="text"
                />
              </FormControl>
              <FormControl id="action" isRequired>
                <FormLabel>Action/Event</FormLabel>
                <Textarea
                  onChange={handleActionChange}
                  value={entry.action}
                  type="text"
                />
              </FormControl>
              {error && (
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
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSave} colorScheme="blue" mr={2}>
              Save
            </Button>
            <Button onClick={handleDelete} colorScheme="red">
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditEntryModal;
