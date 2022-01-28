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
  HStack,
  Grid,
  Box,
  useToast,
} from "@chakra-ui/react";
import { Select, Input, Textarea, StationStatus } from "..";
import { getShiftPersonnel, getStations, updateListItem } from "../../api";
import dayjs from "dayjs";

const StnNote = ({ shift, actionEntry, onSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [error, setError] = useState("");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [shiftMembers, setShiftMembers] = useState([]);
  const [formData, setFormData] = useState({
    category: "STN NOTE - __",
    zuluDate: dayjs(actionEntry.zuluDate).format("YYYY-MM-DD"),
    time: "",
    operatorInitials: actionEntry.operatorInitials,
    action: "",
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

  const handleStationChange = (changedStation, e, name) => {
    const key = e?.target?.name || name;
    const value =
      e?.target?.value === "" || e?.target?.value ? e.target.value : e;

    setSelectedStation((prevStation) => ({ ...prevStation, [key]: value }));
  };

  const handleDataChange = (e) => {
    setError("");
    if (e.target.name === "station") {
      setSelectedStation(
        stations.find((station) => station.station === e.target.value)
      );
    }

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

      const newStation = {
        Id: selectedStation.Id,
        station: selectedStation.station,
        name: selectedStation.name,
        stratdesc: selectedStation.stratdesc,
        stratcolor: selectedStation.stratcolor,
        scansdesc: selectedStation.scansdesc,
        scanscolor: selectedStation.scanscolor,
        aledesc: selectedStation.aledesc,
        alecolor: selectedStation.alecolor,
        dtmfdesc: selectedStation.dtmfdesc,
        dtmfcolor: selectedStation.dtmfcolor,
        otherdesc: selectedStation.otherdesc,
      };
      await updateListItem("stations", newStation);

      await onSubmit(entryObj);

      setFormData({
        ...formData,
        category: "STN NOTE - __",
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
      category: `STN NOTE - ${prevData.station || "__"}`,
      action: `(S) STN ${prevData.station || "__"} ${
        prevData.upgradedOrDowngraded || "__"
      } ATT/ ${
        prevData.fixActionOrReason || "__"
      }/ NOTIFICATIONS HAVE BEEN MADE ATT/ ${
        prevData.operatorInitials || "__"
      } @ ${prevData.timeNotified || "__"}Z COMPLETED NOTIFICATIONS//`,
    }));
  }, [
    formData.station,
    formData.fixActionOrReason,
    formData.timeNotified,
    formData.operatorInitials,
  ]);

  return (
    <>
      <Button onClick={onOpen} isDisabled={formLoading} colorScheme="green">
        {formLoading ? <Spinner /> : "Form Builder"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg="gray.900"
          minW={selectedStation ? "80rem" : "50rem"}
          color="white"
        >
          <ModalHeader>STATION NOTE</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack>
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
                    {shiftMembers?.map((member) => (
                      <option key={member.Id} value={member.initials}>
                        {member.initials} | {member.lastname}
                      </option>
                    ))}
                  </Select>
                </GridItem>
                <GridItem>
                  <FormLabel>STN</FormLabel>
                </GridItem>
                <GridItem>
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
                </GridItem>
                <GridItem>
                  <FormLabel>Upgraded/Downgraded</FormLabel>
                </GridItem>
                <GridItem>
                  <Select
                    onChange={handleDataChange}
                    value={formData.upgradedOrDowngraded}
                    name="upgradedOrDowngraded"
                    placeholder="Select an option"
                  >
                    <option value="UPGRADED">UPGRADED</option>
                    <option value="DOWNGRADED">DOWNGRADED</option>
                  </Select>
                </GridItem>
                <GridItem>
                  <FormLabel>Fix Action/Reason</FormLabel>
                </GridItem>
                <GridItem>
                  <Input
                    onChange={handleDataChange}
                    value={formData.fixActionOrReason}
                    name="fixActionOrReason"
                    type="text"
                  />
                </GridItem>
                <GridItem>
                  <FormLabel>Time Notified (Z)</FormLabel>
                </GridItem>
                <GridItem>
                  <Input
                    onChange={handleDataChange}
                    value={formData.timeNotified}
                    name="timeNotified"
                    type="text"
                  />
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
              {selectedStation && (
                <Box flexGrow="1">
                  <Grid templateColumns="auto">
                    <StationStatus
                      key={selectedStation.Id}
                      handleStationChange={handleStationChange}
                      station={selectedStation}
                    />
                  </Grid>
                </Box>
              )}
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

export default StnNote;
