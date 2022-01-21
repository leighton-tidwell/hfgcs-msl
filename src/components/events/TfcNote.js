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
  Spinner,
  FormLabel,
  GridItem,
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
  CloseButton,
  Grid,
} from "@chakra-ui/react";
import { Select, Input, Textarea, StationStatus } from "..";
import { getShiftPersonnel } from "../../api";
import dayjs from "dayjs";

const StnNote = ({ shift, actionEntry, onSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shiftMembers, setShiftMembers] = useState([]);
  const [formData, setFormData] = useState({
    category: "TFC NOTE - __",
    zuluDate: dayjs(actionEntry.zuluDate).format("YYYY-MM-DD"),
    time: dayjs(actionEntry.time, "HHmm").format("HHmm"),
    operatorInitials: actionEntry.operatorInitials,
    action: "",
    activatedOrDeactivated: "ACTIVATED",
  });

  const fetchShiftMembers = async () => {
    const shiftMembers = await getShiftPersonnel(shift ? shift : "");
    setShiftMembers(shiftMembers);
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

    const entryObj = {
      ...formData,
      zuluDate: dayjs(formData.zuluDate).format("MM/DD/YYYY"),
    };

    await onSubmit(entryObj);

    setFormData({
      ...formData,
      category: "TFC NOTE - __",
      zuluDate: dayjs().format("YYYY-MM-DD"),
      time: dayjs().format("HHmm"),
      action: "",
      activatedOrDeactivated: "ACTIVATED",
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
  }, []);

  useEffect(() => {
    const station =
      formData.unit === "82 RS" || formData.unit === "5 EACCS" ? "JTY" : "ICZ";
    setFormData((prevData) => ({
      ...prevData,
      category: `TFC NOTE - ${station}`,
      action: `(U) ${prevData.unitRepInits || "__"} @ ${
        prevData.unit || "__"
      } ${prevData.activatedOrDeactivated || "__"} ${
        prevData.aircraftCallsign || "__"
      } ${prevData.trafficType || "__"} ATT//`,
    }));
  }, [
    formData.unit,
    formData.unitRepInits,
    formData.activatedOrDeactivated,
    formData.aircraftCallsign,
    formData.trafficType,
  ]);

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
        <ModalContent bg="gray.900" minW="50rem" color="white">
          <ModalHeader>STATION NOTE</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="200px auto" flexGrow="1" gap={2}>
              <GridItem>
                <FormLabel>Event</FormLabel>
              </GridItem>
              <GridItem>
                <Input
                  isDisabled
                  value={formData.category}
                  name="category"
                  type="text"
                />
              </GridItem>
              <GridItem>
                <FormLabel>Zulu Date</FormLabel>
              </GridItem>
              <GridItem>
                <Input
                  onChange={handleDataChange}
                  value={formData.zuluDate}
                  name="zuluDate"
                  type="date"
                />
              </GridItem>
              <GridItem>
                <FormLabel>Time (Z)</FormLabel>
              </GridItem>
              <GridItem>
                <Input
                  onChange={handleDataChange}
                  value={formData.time}
                  name="time"
                  type="text"
                />
              </GridItem>
              <GridItem>
                <FormLabel>Operator Initials</FormLabel>
              </GridItem>
              <GridItem>
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
              </GridItem>
              <GridItem>
                <FormLabel>Unit Rep Intials</FormLabel>
              </GridItem>
              <GridItem>
                <Input
                  onChange={handleDataChange}
                  value={formData.unitRepInits}
                  name="unitRepInits"
                  type="text"
                />
              </GridItem>
              <GridItem>
                <FormLabel>Unit</FormLabel>
              </GridItem>
              <GridItem>
                <Select
                  value={formData.unit}
                  name="unit"
                  onChange={handleDataChange}
                  placeholder="Select a Unit"
                >
                  <option value="82 RS">82 RS</option>
                  <option value="5 EACCS">5 EACCS</option>
                  <option value="21 ERS">21 ERS</option>
                  <option value="24 ERS">24 ERS</option>
                </Select>
              </GridItem>
              <GridItem>
                <FormLabel>Activated/Deactivated</FormLabel>
              </GridItem>
              <GridItem>
                <Select
                  onChange={handleDataChange}
                  value={formData.activatedOrDeactivated}
                  name="activatedOrDeactivated"
                >
                  <option value="ACTIVATED">ACTIVATED</option>
                  <option value="DEACTIVATED">DEACTIVATED</option>
                </Select>
              </GridItem>
              <GridItem>
                <FormLabel>Aircraft Callsign</FormLabel>
              </GridItem>
              <GridItem>
                <Input
                  onChange={handleDataChange}
                  value={formData.aircraftCallsign}
                  name="aircraftCallsign"
                  type="text"
                />
              </GridItem>
              <GridItem>
                <FormLabel>Traffic Type</FormLabel>
              </GridItem>
              <GridItem>
                <Select
                  value={formData.trafficType}
                  name="trafficType"
                  onChange={handleDataChange}
                  placeholder="Select a Traffic Type"
                >
                  <option value="MTO">MTO</option>
                  <option value="R&A">R&A</option>
                </Select>
              </GridItem>
              <GridItem>
                <FormLabel>Action/Event</FormLabel>
              </GridItem>
              <GridItem>
                <Textarea
                  onChange={handleDataChange}
                  name="action"
                  type="text"
                  value={formData.action}
                />
              </GridItem>
            </Grid>
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

export default StnNote;
