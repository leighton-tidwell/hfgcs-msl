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
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { Input, Textarea } from ".";
import { EditIcon } from ".";
import { getAction } from "../api";
import dayjs from "dayjs";

const EditEntryModal = ({ entryID, updateEntry, removeEntry }) => {
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
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
  const toast = useToast();

  const fetchEntryDetails = async () => {
    try {
      const response = await getAction(entryID);
      if (!response.length) throw new Error("entry not found.");
      const newEntry = {
        ...response[0],
        entrydate: dayjs(response[0].entrydate).format("YYYY-MM-DD"),
      };
      setEntry(newEntry);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
      onClose();
    }
    setLoading(false);
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

  const handleSave = async () => {
    setError("");
    const zuluTimeRegEx = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);
    const timeValidation = zuluTimeRegEx.test(entry.entrytime);
    if (!timeValidation) return setError("You must enter a valid time.");
    if (!entry.entrydate) return setError("You must enter a date.");
    if (!entry.operatorinitials)
      return setError("You must enter operator initials.");
    if (!entry.action) return setError("You must enter an action.");
    if (!entry.eventcategory) return setError("You must enter a category.");
    setLoadingSave(true);

    try {
      const entryObj = {
        action: entry.action,
        operatorinitials: entry.operatorinitials,
        Id: entry.Id,
        eventcategory: entry.eventcategory,
        entrytime: entry.entrytime,
        entrydate: dayjs(entry.entrydate).format("MM/DD/YYYY"),
      };

      await updateEntry(entryObj);
      onClose();
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
    setLoadingSave(false);
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await removeEntry(entry.Id);
      onClose();
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
    setLoadingDelete(false);
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
          <ModalHeader>
            Edit Entry {loading && <Spinner size="sm" />}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl id="event-category" isRequired>
                <FormLabel>Event Category</FormLabel>
                <Input
                  isDisabled={loading}
                  onChange={handleCategoryChange}
                  value={entry.eventcategory}
                />
              </FormControl>
              <FormControl id="date" isRequired>
                <FormLabel>Zulu Date</FormLabel>
                <Input
                  isDisabled={loading}
                  onChange={handleDateChange}
                  value={entry.entrydate}
                  type="date"
                />
              </FormControl>
              <FormControl id="time" isRequired>
                <FormLabel>Time (Z)</FormLabel>
                <Input
                  isDisabled={loading}
                  onChange={handleTimeChange}
                  value={entry.entrytime}
                  type="text"
                />
              </FormControl>
              <FormControl id="op-init" isRequired>
                <FormLabel>Operator Initials</FormLabel>
                <Input
                  isDisabled={loading}
                  onChange={handleOperatorInitialsChange}
                  value={entry.operatorinitials}
                  type="text"
                />
              </FormControl>
              <FormControl id="action" isRequired>
                <FormLabel>Action/Event</FormLabel>
                <Textarea
                  isDisabled={loading}
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
            <Button
              onClick={handleSave}
              disabled={loadingSave}
              colorScheme="blue"
              mr={2}
            >
              {loadingSave ? <Spinner /> : "Save"}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loadingDelete}
              colorScheme="red"
            >
              {loadingDelete ? <Spinner /> : "Delete"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditEntryModal;
