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
  HStack,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Select, Input, Textarea } from "..";
import { getShiftPersonnel, getStations } from "../../api";
import dayjs from "dayjs";

const NetNote = ({ shift, actionEntry, onSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [error, setError] = useState("");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [shiftMembers, setShiftMembers] = useState([]);
  const [formData, setFormData] = useState({
    category: "NET NOTE",
    zuluDate: dayjs(actionEntry.zuluDate).format("YYYY-MM-DD"),
    time: "",
    operatorInitials: actionEntry.operatorInitials,
    action: "",
    enterOrExit: "ENTERED",
  });

  const fetchShiftMembers = async () => {
    try {
      const shiftMembers = await getShiftPersonnel(shift ? shift : "");
      setShiftMembers(shiftMembers);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const fetchStations = async () => {
    try {
      const stations = await getStations();
      setStations(stations);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
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

    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    try {
      const entryObj = {
        ...formData,
        zuluDate: dayjs(formData.zuluDate).format("MM/DD/YYYY"),
      };

      await onSubmit(entryObj);

      setFormData({
        ...formData,
        category: "NET NOTE",
        zuluDate: dayjs().format("YYYY-MM-DD"),
        time: dayjs().format("HHmm"),
        action: "",
      });
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }

    setLoading(false);
    onClose();
  };

  const clearError = () => {
    setError("");
    setLoading(false);
  };

  const loadFormBuilder = async () => {
    await Promise.all([await fetchShiftMembers(), await fetchStations()]);
    setFormLoading(false);
  };

  useEffect(() => {
    loadFormBuilder();
  }, []);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      action: `(U) ${formData.aircraftCallsign || "__"} ${
        formData.enterOrExit
      } THE NET ATT/ ${formData.authenticatingPersonnel || "__"} @ ${
        formData.station || "__"
      } ZNB WITH ${formData.opChallenge || "__"} AND WAS CHALLENGED WITH ${
        formData.acChallenge || "__"
      }//`,
    }));
  }, [
    formData.aircraftCallsign,
    formData.enterOrExit,
    formData.authenticatingPersonnel,
    formData.station,
    formData.opChallenge,
    formData.acChallenge,
  ]);

  return (
    <>
      <Button onClick={onOpen} isDisabled={formLoading} colorScheme="green">
        {formLoading ? <Spinner /> : "Form Builder"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900" minW="60rem" color="white">
          <ModalHeader>NET NOTE</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack alignItems="flex-start" spacing={4}>
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
                    {shiftMembers?.map((member) => (
                      <option key={member.Id} value={member.initials}>
                        {member.initials} | {member.lastname}
                      </option>
                    ))}
                  </Select>
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
              <VStack flexGrow="1" spacing={4}>
                <FormControl id="aircraftCallsign" isRequired>
                  <FormLabel>Aircraft Callsign</FormLabel>
                  <Input
                    onChange={handleDataChange}
                    value={formData.aircraftCallsign}
                    name="aircraftCallsign"
                    type="text"
                  />
                </FormControl>
                <FormControl id="enterOrExit" isRequired>
                  <FormLabel>ENTER/EXIT</FormLabel>
                  <Select
                    value={formData.enterOrExit}
                    name="enterOrExit"
                    onChange={handleDataChange}
                  >
                    <option value="ENTERED">ENTERED</option>
                    <option value="EXITED">EXITED</option>
                  </Select>
                </FormControl>
                <FormControl id="authenticatingPersonnel" isRequired>
                  <FormLabel>Authenticating Personnel</FormLabel>
                  <Input
                    onChange={handleDataChange}
                    value={formData.authenticatingPersonnel}
                    name="authenticatingPersonnel"
                    type="text"
                  />
                </FormControl>
                <FormControl id="station" isRequired>
                  <FormLabel>STN</FormLabel>
                  <Select
                    value={formData.station}
                    name="station"
                    onChange={handleDataChange}
                    placeholder="Select station"
                  >
                    {stations?.map((station) => (
                      <option key={station.Id} value={station.station}>
                        {station.station}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="opChallenge" isRequired>
                  <FormLabel>OP Challenge</FormLabel>
                  <Input
                    onChange={handleDataChange}
                    value={formData.opChallenge}
                    name="opChallenge"
                    type="text"
                  />
                </FormControl>
                <FormControl id="acChallenge" isRequired>
                  <FormLabel>AC Challenge</FormLabel>
                  <Input
                    onChange={handleDataChange}
                    value={formData.acChallenge}
                    name="acChallenge"
                    type="text"
                  />
                </FormControl>
              </VStack>
            </HStack>
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

export default NetNote;
