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
  Spinner,
} from "@chakra-ui/react";
import { Select, Input, Textarea } from "..";
import { getShiftPersonnel, getRXMedians } from "../../api";
import dayjs from "dayjs";

const DefconStatus = ({ shift, actionEntry, onSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rxMedians, setRxMedians] = useState([]);
  const [shiftMembers, setShiftMembers] = useState([]);
  const [formData, setFormData] = useState({
    category: "DEFCON STATUS",
    zuluDate: dayjs().format("YYYY-MM-DD"),
    time: dayjs().format("HHmm"),
    operatorInitials: actionEntry.operatorInitials,
    action: "",
    defconLevel: "",
  });

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

  const fetchShiftMembers = async () => {
    const shiftMembers = await getShiftPersonnel(shift ? shift : "");
    setShiftMembers(shiftMembers);
  };

  const fetchRxMedians = async () => {
    const rxMedianList = await getRXMedians("eam");
    setRxMedians(rxMedianList);

    const defaultRx = rxMedianList.find((median) => median.default === "true");
    setFormData((prevFormData) => ({
      ...prevFormData,
      rxMedian: defaultRx ? defaultRx.name : "",
    }));
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
    setLoading(true);

    const entryObj = {
      ...formData,
      zuluDate: dayjs(formData.zuluDate).format("MM/DD/YYYY"),
    };

    setFormData({
      ...formData,
      category: "DEFCON STATUS",
      zuluDate: dayjs().format("YYYY-MM-DD"),
      time: dayjs().format("HHmm"),
      action: "",
    });

    onSubmit(entryObj);
    setLoading(false);
    onClose();
  };

  const clearError = () => {
    setError("");
    setLoading(false);
  };

  useEffect(() => {
    fetchRxMedians();
    fetchShiftMembers();
  }, []);

  useEffect(() => {
    const actionText = `(S) RCVD MESSAGE VIA ${
      formData.rxMedian
    } INDICATING MOVEMENT TO DEFCON ${formData.defconLevel}${
      formData.defconLevel <= 2 ? "/ WILL POLL FOR TRAFFIC @ 00Z @ 30Z" : ""
    }//`;
    setFormData((prevData) => ({
      ...prevData,
      action: actionText,
    }));
  }, [formData.rxMedian, formData.defconLevel]);

  return (
    <>
      <Button onClick={onOpen} colorScheme="green">
        Form Builder
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white">
          <ModalHeader>DEFCON STATUS</ModalHeader>
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
              <FormControl id="rxMedian" isRequired>
                <FormLabel>RX Median</FormLabel>
                <Select
                  value={formData.rxMedian}
                  name="rxMedian"
                  onChange={handleDataChange}
                >
                  {rxMedians.map((median) => (
                    <option key={median.Id} value={median.name}>
                      {median.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id="defconLevel" isRequired>
                <FormLabel>DEFCON Level</FormLabel>
                <Select
                  value={formData.defconLevel}
                  name="defconLevel"
                  placeholder="Select DEFCON Level"
                  onChange={handleDataChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
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

export default DefconStatus;
