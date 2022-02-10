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
  Text,
  Grid,
  Box,
  Stack,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Select, Input, Textarea, StationStatus } from "..";
import { getShiftPersonnel, getStations, updateListItem } from "../../api";
import dayjs from "dayjs";

const Checklist108End = ({ shift, actionEntry, onSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [shiftMembers, setShiftMembers] = useState([]);
  const [stations, setStations] = useState([]);
  const [toggleStations, setToggleStations] = useState("ANCS");
  const [formData, setFormData] = useState({
    category: "CHKLST NOTE - 102 (END)",
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

  const handleStationChange = (changedStation, e, name) => {
    const key = e?.target?.name || name;
    const value =
      e?.target?.value === "" || e?.target?.value ? e.target.value : e;

    setStations((prevStations) =>
      prevStations.map((station) => {
        if (station.station === changedStation)
          return { ...station, [key]: value };
        return station;
      })
    );
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

      await Promise.all(
        stations.map(async (station) => {
          const newStation = {
            Id: station.Id,
            station: station.station,
            name: station.name,
            stratdesc: station.stratdesc,
            stratcolor: station.stratcolor,
            scansdesc: station.scansdesc,
            scanscolor: station.scanscolor,
            aledesc: station.aledesc,
            alecolor: station.alecolor,
            dtmfdesc: station.dtmfdesc,
            dtmfcolor: station.dtmfcolor,
            otherdesc: station.otherdesc,
          };
          await updateListItem("stations", newStation);
        })
      );

      await onSubmit(entryObj);

      setFormData({
        ...formData,
        category: "CHKLST NOTE - 102 (END)",
        zuluDate: dayjs().format("YYYY-MM-DD"),
        time: dayjs().format("HHmm"),
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
    const stationStatuses = stations.map((station) => {
      let statusText = `${station.station}: `;
      if (station.stratdesc !== "" && station.stratdesc !== null)
        statusText += `STRAT: ${station.stratdesc}, `;
      if (station.scansdesc !== "" && station.scansdesc !== null)
        statusText += `SCANS: ${station.scansdesc}, `;
      if (station.aledesc !== "" && station.aledesc !== null)
        statusText += `ALE: ${station.aledesc}, `;
      if (station.dtmfdesc !== "" && station.dtmfdesc !== null)
        statusText += `DTMF: ${station.dtmfdesc}, `;
      if (station.otherdesc !== "" && station.otherdesc !== null)
        statusText += `OTHER: ${station.otherdesc} `;
      if (statusText !== `${station.station}: `) return statusText;
    });

    setFormData((prevData) => ({
      ...prevData,
      action: `(S) OPERATORS HAVE COMPLETED THEIR 4 HOUR STN OPS CHECKS ATT/ ${stationStatuses
        .filter((e) => e)
        .join("/ ")} ALL OTHER STNS OPS NORMAL//`,
    }));
  }, [stations]);

  return (
    <>
      <Button onClick={onOpen} isDisabled={formLoading} colorScheme="green">
        {formLoading ? <Spinner /> : "Form Builder"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW="95VW" bg="gray.900" color="white">
          <ModalHeader>
            CHKLST NOTE - 102 (END) {formLoading && <Spinner size="sm" />}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction="row" spacing={5}>
              <VStack flexGrow="1" spacing={4} mt={5}>
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
                    isDisabled={formLoading}
                    onChange={handleDataChange}
                    value={formData.zuluDate}
                    name="zuluDate"
                    type="date"
                  />
                </FormControl>
                <FormControl id="time" isRequired>
                  <FormLabel>Time (Z)</FormLabel>
                  <Input
                    isDisabled={formLoading}
                    onChange={handleDataChange}
                    value={formData.time}
                    name="time"
                    type="text"
                  />
                </FormControl>
                <FormControl id="op-init" isRequired>
                  <FormLabel>Operator Initials</FormLabel>
                  <Select
                    isDisabled={formLoading}
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
                    isDisabled={formLoading}
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
              <Box flexGrow="1">
                <Box display="flex" alignItems="center" mb={2}>
                  <Text flexGrow="1" fontWeight="bold" fontSize="lg">
                    Station Statuses
                  </Text>
                  <Button
                    isDisabled={formLoading}
                    colorScheme="blue"
                    onClick={() =>
                      setToggleStations(
                        toggleStations === "ANCS" ? "GFNCS" : "ANCS"
                      )
                    }
                  >
                    Show {toggleStations === "ANCS" ? "GFNCS" : "ANCS"} Stations
                  </Button>
                </Box>
                {stations.length ? (
                  <Grid templateColumns="auto auto" alignItems="center" gap={3}>
                    {stations?.map(
                      (station) =>
                        station.ncs === toggleStations && (
                          <StationStatus
                            key={station.Id}
                            handleStationChange={handleStationChange}
                            station={station}
                          />
                        )
                    )}
                  </Grid>
                ) : (
                  <Spinner size="lg" />
                )}
              </Box>
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
            <Button
              disabled={loading || formLoading}
              colorScheme="blue"
              onClick={handleSave}
            >
              {loading ? <Spinner size="sm" /> : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Checklist108End;
