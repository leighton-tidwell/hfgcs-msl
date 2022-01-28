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
  VStack,
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
  CloseButton,
  Stack,
  Grid,
  GridItem,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Select, Input, Textarea } from "..";
import {
  getShiftPersonnel,
  getMNCSSchedule,
  updateListItem,
  getActionsForDate,
  getStations,
  getRXMedians,
  getMSGOriginators,
  getReportingCMD,
} from "../../api";
import dayjs from "dayjs";

const FoxFairly = ({ shift, actionEntry, onSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [shiftMembers, setShiftMembers] = useState([]);
  const [currentMncs, setCurrentMncs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [stations, setStations] = useState([]);
  const [rxMedians, setRxMedians] = useState([]);
  const [msgOriginators, setMsgOriginators] = useState([]);
  const [reportingCMDs, setReportingCMDs] = useState([]);
  const [formData, setFormData] = useState({
    category: "FOX FAIRLY",
    zuluDate: dayjs(actionEntry.zuluDate).format("YYYY-MM-DD"),
    time: "",
    operatorInitials: actionEntry.operatorInitials,
    action: "",
  });
  const [foxData, setFoxData] = useState({
    message: "",
    txNcs: "ANCS",
  });
  const [totalFairly, setTotalFairly] = useState(1);
  const [error, setError] = useState(null);

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

  const fetchMNCSSchedule = async () => {
    try {
      const mncsSchedule = await getMNCSSchedule();
      const currentMonth = dayjs().get("month") + 1;

      const ancsSchedule = mncsSchedule
        .find((mncs) => mncs.ncs === "ANCS")
        .months.split(",");

      const isAncsCurrent =
        ancsSchedule.indexOf(currentMonth.toString()) !== -1;
      setCurrentMncs(isAncsCurrent ? "ANCS" : "GFNCS");
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const fetchLastFairly = async () => {
    try {
      const allActions = await getActionsForDate(dayjs().format("MM/DD/YYYY"));
      const lastFairly = allActions.filter((item) =>
        item.eventcategory.includes("FOX #")
      );
      setTotalFairly(lastFairly.length + 1);
      setFormData({
        ...formData,
        category: `FOX #${lastFairly.length + 1} - FAIRLY`,
      });
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

  const fetchRxMedians = async () => {
    try {
      const rxMedianList = await getRXMedians("fox");
      setRxMedians(rxMedianList);

      const defaultRx = rxMedianList.find(
        (median) => median.default === "true"
      );
      setFoxData((prevFoxData) => ({
        ...prevFoxData,
        rxMedian: defaultRx ? defaultRx.name : "",
      }));
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const fetchMSGOriginators = async () => {
    try {
      const msgOriginatorList = await getMSGOriginators("fox");
      setMsgOriginators(msgOriginatorList);

      const defaultMsg = msgOriginatorList.find(
        (originator) => originator.default === "true"
      );
      setFoxData((prevFoxData) => ({
        ...prevFoxData,
        msgOriginator: defaultMsg ? defaultMsg.name : "",
      }));
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const fetchReportingCMD = async () => {
    try {
      const reportingCMD = await getReportingCMD();
      setReportingCMDs(reportingCMD);

      const defaultCMD = reportingCMD.find((cmd) => cmd.default === "true");
      setFoxData((prevFoxData) => ({
        ...prevFoxData,
        reportingCMD: defaultCMD ? defaultCMD.name : "",
      }));
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleStationObservationChange = (Id, e) => {
    setStations((prevStations) =>
      prevStations.map((station) => {
        if (station.Id === Id)
          return { ...station, observation: e.target.value };
        return station;
      })
    );
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

  const handleFoxDataChange = (e) => {
    if (e.target.name === "timeOfTransit" && e.target.value.length <= 4) {
      return setFoxData((prevFoxData) => ({
        ...prevFoxData,
        [e.target.name]: e.target.value.replace(/[^0-9]/g, ""),
      }));
    }
    if (e.target.name === "timeOfTransit" && e.target.value.length > 4) return;

    setFoxData((prevFoxData) => ({
      ...prevFoxData,
      [e.target.name]: e.target.value,
    }));
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

      Promise.all(
        stations.map(async (station) => {
          const newStation = {
            Id: station.Id,
            observation: station.observation,
          };

          await updateListItem("stations", newStation);

          return newStation;
        })
      );

      await onSubmit(entryObj);

      setFormData({
        ...formData,
        category: `FOX #${totalFairly + 1} - FAIRLY`,
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
    await Promise.all([
      await fetchShiftMembers(),
      await fetchMNCSSchedule(),
      await fetchLastFairly(),
      await fetchStations(),
      await fetchRxMedians(),
      await fetchMSGOriginators(),
      await fetchReportingCMD(),
    ]);
    setFormLoading(false);
  };

  useEffect(() => {
    loadFormBuilder();
  }, []);

  useEffect(() => {
    const notNormalStations = stations
      .filter((e) => e.observation !== "STN FVRS")
      .map((e) => ({ name: e.station, observation: e.observation }));

    const stnfvrString = notNormalStations.length
      ? notNormalStations
          .map((e) => `${e.name}: ${e.observation || ""}`)
          .join("/ ") + " ALL OTHERS STN FVRS"
      : "ALL STN FVRS";

    setFormData((prevData) => ({
      ...prevData,
      action: `(S) RCVD ${foxData.message || "______"} VIA ${
        foxData.rxMedian || "______"
      } FROM ${foxData.msgOriginator || "______"}/ ${
        foxData.txOperator || "______"
      } @ ${foxData.txNcs || "______"} TOT ${
        foxData.timeOfTransit || "______"
      }Z/ ZNB BY: ${foxData.authByFirst || "______"} & ${
        foxData.authBySecond || "______"
      }/ ANCS AND ${
        foxData.gfncsOperator || "______"
      } @ GFNCS CONFIRMS THE FOLLOWING: ${stnfvrString}/${
        foxData.cmdOperator || "______"
      } @ ${foxData.reportingCMD || "______"} TOD ${
        foxData.timeOfDelivery || "______"
      }Z//`,
    }));
  }, [foxData, stations]);

  return (
    <>
      <Button onClick={onOpen} isDisabled={formLoading} colorScheme="green">
        {formLoading ? <Spinner /> : "Form Builder"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW="50vw" bg="gray.900" color="white">
          <ModalHeader>FOX FAIRLY</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction="row" spacing={5}>
              <VStack flexGrow="1" spacing={2}>
                <Grid
                  templateColumns="125px 150px 125px 150px"
                  gap={1}
                  alignItems="center"
                  mt={4}
                >
                  <GridItem>
                    <Text>Event</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Input
                      isDisabled
                      value={formData.category}
                      name="category"
                      type="text"
                      size="sm"
                    />
                  </GridItem>
                  <GridItem>
                    <Text>Zulu Date</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Input
                      onChange={handleDataChange}
                      value={formData.zuluDate}
                      name="zuluDate"
                      type="date"
                      size="sm"
                    />
                  </GridItem>
                  <GridItem>
                    <Text>Time (Z)</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Input
                      onChange={handleDataChange}
                      value={formData.time}
                      name="time"
                      type="text"
                      size="sm"
                    />
                  </GridItem>
                  <GridItem>
                    <Text>Operator Initials</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Select
                      value={formData.operatorInitials}
                      placeholder="Select an operator"
                      name="operatorInitials"
                      onChange={handleDataChange}
                      size="sm"
                    >
                      {shiftMembers?.map((member) => (
                        <option key={member.Id} value={member.initials}>
                          {member.initials} | {member.lastname}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem>
                    <Text>Message</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Input
                      onChange={handleFoxDataChange}
                      value={foxData.message}
                      name="message"
                      size="sm"
                      type="text"
                    />
                  </GridItem>
                  <GridItem>
                    <Text>Recieve Median</Text>
                  </GridItem>
                  <GridItem>
                    <Select
                      value={foxData.rxMedian}
                      name="rxMedian"
                      onChange={handleFoxDataChange}
                      size="sm"
                    >
                      {rxMedians?.map((median) => (
                        <option key={median.Id} value={median.name}>
                          {median.name}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem>
                    <Text>MSG Originator</Text>
                  </GridItem>
                  <GridItem>
                    <Select
                      value={foxData.msgOriginator}
                      name="msgOriginator"
                      onChange={handleFoxDataChange}
                      size="sm"
                    >
                      {msgOriginators?.map((originator) => (
                        <option key={originator.Id} value={originator.name}>
                          {originator.name}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem>
                    <Text>TX Operator</Text>
                  </GridItem>
                  <GridItem>
                    <Input
                      onChange={handleFoxDataChange}
                      value={foxData.txOperator}
                      name="txOperator"
                      type="text"
                      size="sm"
                    />
                  </GridItem>
                  <GridItem>
                    <Text>TX NCS</Text>
                  </GridItem>
                  <GridItem>
                    <Select
                      value={foxData.txNcs}
                      name="txNcs"
                      onChange={handleFoxDataChange}
                      size="sm"
                    >
                      <option value="ANCS">ANCS</option>
                      <option value="GFNCS">GFNCS</option>
                    </Select>
                  </GridItem>
                  <GridItem>
                    <Text>Time of Transmit</Text>
                  </GridItem>
                  <GridItem>
                    <Input
                      onChange={handleFoxDataChange}
                      value={foxData.timeOfTransit}
                      name="timeOfTransit"
                      type="text"
                      size="sm"
                    />
                  </GridItem>
                  <GridItem colSpan={2}></GridItem>
                  <GridItem>
                    <Text>Auth By</Text>
                  </GridItem>
                  <GridItem>
                    <Select
                      value={foxData.authByFirst}
                      placeholder="Select an operator"
                      name="authByFirst"
                      onChange={handleFoxDataChange}
                      size="sm"
                    >
                      {shiftMembers?.map((member) => (
                        <option key={member.Id} value={member.initials}>
                          {member.initials} | {member.lastname}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem>
                    <Select
                      value={foxData.authBySecond}
                      placeholder="Select an operator"
                      name="authBySecond"
                      onChange={handleFoxDataChange}
                      size="sm"
                    >
                      {shiftMembers?.map((member) => (
                        <option key={member.Id} value={member.initials}>
                          {member.initials} | {member.lastname}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem></GridItem>
                  <GridItem>
                    <Text>GFNCS Operator</Text>
                  </GridItem>
                  <GridItem>
                    <Input
                      onChange={handleFoxDataChange}
                      value={foxData.gfncsOperator}
                      name="gfncsOperator"
                      type="text"
                      size="sm"
                    />
                  </GridItem>
                  <GridItem colSpan={2}></GridItem>
                  <GridItem>
                    <Text>Reporting CMD</Text>
                  </GridItem>
                  <GridItem>
                    <Select
                      value={foxData.reportingCMD}
                      name="reportingCMD"
                      onChange={handleFoxDataChange}
                      size="sm"
                    >
                      {reportingCMDs?.map((cmd) => (
                        <option key={cmd.Id} value={cmd.name}>
                          {cmd.name}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem>
                    <Text>CMD Operator</Text>
                  </GridItem>
                  <GridItem>
                    <Input
                      onChange={handleFoxDataChange}
                      value={foxData.cmdOperator}
                      name="cmdOperator"
                      type="text"
                      size="sm"
                    />
                  </GridItem>
                  <GridItem>
                    <Text>Time Of Delivery</Text>
                  </GridItem>
                  <GridItem>
                    <Input
                      onChange={handleFoxDataChange}
                      value={foxData.timeOfDelivery}
                      name="timeOfDelivery"
                      type="text"
                      size="sm"
                    />
                  </GridItem>
                  <GridItem colSpan={2}></GridItem>
                  <GridItem>
                    <Text>Action/Event</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Textarea
                      onChange={handleDataChange}
                      name="action"
                      type="text"
                      value={formData.action}
                      minHeight="200px"
                      size="sm"
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
              </VStack>
              <VStack flexGrow="1" spacing={4}>
                <Grid
                  templateColumns="50px auto"
                  gap={1}
                  alignItems="center"
                  mt={4}
                >
                  <GridItem colSpan={2}>
                    Station Broadcast Observations
                  </GridItem>
                  {stations?.map((station) => (
                    <>
                      <GridItem>
                        <Text>{station.station}</Text>
                      </GridItem>
                      <GridItem>
                        <Input
                          onChange={(e) =>
                            handleStationObservationChange(station.Id, e)
                          }
                          size="sm"
                          value={station.observation}
                        />
                      </GridItem>
                    </>
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

export default FoxFairly;
