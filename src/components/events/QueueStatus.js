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
  PinInput,
  PinInputField,
  Checkbox,
  Spinner,
} from "@chakra-ui/react";
import { Select, Input, Textarea } from "..";
import { getShiftPersonnel, getRXMedians } from "../../api";
import dayjs from "dayjs";

const QueueStatus = ({ shift, actionEntry, onSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState("");
  const [rxMedians, setRxMedians] = useState([]);
  const [shiftMembers, setShiftMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "QUEUE STATUS",
    zuluDate: dayjs().format("YYYY-MM-DD"),
    time: dayjs().format("HHmm"),
    operatorInitials: actionEntry.operatorInitials,
    shiftLeadRank: "",
    action: "",
    broadcastRequirements: false,
  });

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
      category: "QUEUE STATUS",
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
    fetchShiftMembers();
    fetchRxMedians();
  }, []);

  useEffect(() => {
    const queueMessage =
      !formData.preambleOne && !formData.preambleTwo && !formData.preambleThree
        ? `NONE${
            formData.broadcastRequirements
              ? "/ REBROADCAST REQUIREMENTS ARE CANCELLED"
              : ""
          }`
        : `${[
            formData.preambleOne,
            formData.preambleTwo,
            formData.preambleThree,
          ]
            .filter((e) => e)
            .join("/ ")}`;

    setFormData((prevData) => ({
      ...prevData,
      action: `(S) RCVD QUEUE STATUS VIA ${formData.rxMedian}/ QUEUE IS AS FOLLOWS: ${queueMessage}//`,
    }));
  }, [
    formData.preambleOne,
    formData.preambleTwo,
    formData.preambleThree,
    formData.broadcastRequirements,
    formData.rxMedian,
  ]);

  return (
    <>
      <Button onClick={onOpen} colorScheme="green">
        Form Builder
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900" minW="60rem" color="white">
          <ModalHeader>QUEUE STATUS</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack alignItems="flex-start">
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
                    {shiftMembers.map((member) => (
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
                <FormControl id="preambleOne" isRequired>
                  <FormLabel>Preamble One</FormLabel>
                  <HStack>
                    <PinInput
                      onChange={(val) =>
                        handleDataChange({
                          target: { name: "preambleOne", value: val },
                        })
                      }
                      value={formData.preambleOne}
                      type="alphanumeric"
                    >
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                    </PinInput>
                  </HStack>
                </FormControl>
                <FormControl id="preambleTwo" isRequired>
                  <FormLabel>Preamble Two</FormLabel>
                  <HStack>
                    <PinInput
                      onChange={(val) =>
                        handleDataChange({
                          target: { name: "preambleTwo", value: val },
                        })
                      }
                      value={formData.preambleTwo}
                      type="alphanumeric"
                    >
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                    </PinInput>
                  </HStack>
                </FormControl>
                <FormControl id="preambleThree" isRequired>
                  <FormLabel>Preamble Three</FormLabel>
                  <HStack>
                    <PinInput
                      onChange={(val) =>
                        handleDataChange({
                          target: { name: "preambleThree", value: val },
                        })
                      }
                      value={formData.preambleThree}
                      type="alphanumeric"
                    >
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                      <PinInputField
                        borderColor="blue.700"
                        borderWidth="2px"
                        _hover={{
                          borderColor: "blue.600",
                          background: "gray.700",
                        }}
                        _focus={{
                          background: "gray.700",
                        }}
                      />
                    </PinInput>
                  </HStack>
                </FormControl>
                <FormControl id="broadcastRequirements">
                  <Checkbox
                    value={formData.broadcastRequirements}
                    name="broadcastRequirements"
                    onChange={(e) =>
                      handleDataChange({
                        target: {
                          name: "broadcastRequirements",
                          value: !formData.broadcastRequirements,
                        },
                      })
                    }
                  >
                    Rebroadcast Requirements Cancelled
                  </Checkbox>
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

export default QueueStatus;
