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
  HStack,
  PinInput,
  PinInputField,
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
} from "@chakra-ui/react";
import { Select, Input, Textarea } from "..";
import {
  getShiftPersonnel,
  getMNCSSchedule,
  updateListItem,
  getStations,
  getRXMedians,
  getMSGOriginators,
  getReportingCMD,
  getBroadcastingSchedule,
} from "../../api";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const NuEAM = ({ shift, actionEntry, onSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shiftMembers, setShiftMembers] = useState([]);
  const [currentMncs, setCurrentMncs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState([]);
  const [rxMedians, setRxMedians] = useState([]);
  const [msgOriginators, setMsgOriginators] = useState([]);
  const [reportingCMDs, setReportingCMDs] = useState([]);
  const [broadcastSchedule, setBroadcastSchedule] = useState([]);
  const [formData, setFormData] = useState({
    category: "NU EAM",
    zuluDate: dayjs().format("YYYY-MM-DD"),
    time: dayjs().format("HHmm"),
    operatorInitials: actionEntry.operatorInitials,
    action: "",
  });
  const [eamData, setEamData] = useState({
    message: "",
    txNcs: "ANCS",
  });
  const [error, setError] = useState(null);

  const fetchShiftMembers = async () => {
    const shiftMembers = await getShiftPersonnel(shift ? shift : "");
    setShiftMembers(shiftMembers);
  };

  const fetchMNCSSchedule = async () => {
    const mncsSchedule = await getMNCSSchedule();
    const currentMonth = dayjs().get("month") + 1;

    const ancsSchedule = mncsSchedule
      .find((mncs) => mncs.ncs === "ANCS")
      .months.split(",");

    const isAncsCurrent = ancsSchedule.indexOf(currentMonth.toString()) !== -1;
    setCurrentMncs(isAncsCurrent ? "ANCS" : "GFNCS");
  };

  const fetchStations = async () => {
    const stations = await getStations();
    setStations(stations);
  };

  const fetchRxMedians = async () => {
    const rxMedianList = await getRXMedians("eam");
    setRxMedians(rxMedianList);

    const defaultRx = rxMedianList.find((median) => median.default === "true");
    setEamData((prevEamData) => ({
      ...prevEamData,
      rxMedian: defaultRx ? defaultRx.name : "",
    }));
  };

  const fetchMSGOriginators = async () => {
    const msgOriginatorList = await getMSGOriginators("eam");
    setMsgOriginators(msgOriginatorList);

    const defaultMsg = msgOriginatorList.find(
      (originator) => originator.default === "true"
    );
    setEamData((prevEamData) => ({
      ...prevEamData,
      msgOriginator: defaultMsg ? defaultMsg.name : "",
    }));
  };

  const fetchReportingCMD = async () => {
    const reportingCMD = await getReportingCMD();
    setReportingCMDs(reportingCMD);

    const defaultCMD = reportingCMD.find((cmd) => cmd.default === "true");
    setEamData((prevEamData) => ({
      ...prevEamData,
      reportingCMD: defaultCMD ? defaultCMD.name : "",
    }));
  };

  const fetchBroadcastingSchedule = async () => {
    const broadcastingSchedule = await getBroadcastingSchedule();
    const formattedBroadcastSchedule = broadcastingSchedule
      .map((schedule) => ({
        time: schedule.time,
        ncs: schedule.ncs,
        Id: schedule.Id,
      }))
      .sort((a, b) => (a.time > b.time ? 1 : -1));

    const currentTime = dayjs().format("HHmm");

    for (let i = 0; i < formattedBroadcastSchedule.length; i++) {
      if (
        currentTime > formattedBroadcastSchedule[i].time &&
        currentTime < formattedBroadcastSchedule[i + 1].time
      ) {
        setEamData((prevEamData) => ({
          ...prevEamData,
          txNcs: formattedBroadcastSchedule[i].ncs,
        }));
        break;
      }

      if (
        currentTime > formattedBroadcastSchedule[i].time &&
        formattedBroadcastSchedule[i + 1] === undefined
      ) {
        setEamData((prevEamData) => ({
          ...prevEamData,
          txNcs: formattedBroadcastSchedule[i].ncs,
        }));
        break;
      }
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

  const handleEAMDataChange = (e) => {
    if (e.target.name === "timeOfTransit" && e.target.value.length <= 4) {
      return setEamData((prevEamData) => ({
        ...prevEamData,
        [e.target.name]: e.target.value.replace(/[^0-9]/g, ""),
      }));
    }
    if (e.target.name === "timeOfTransit" && e.target.value.length > 4) return;

    setEamData((prevEamData) => ({
      ...prevEamData,
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

    const entryObj = {
      ...formData,
      zuluDate: dayjs(formData.zuluDate).format("MM/DD/YYYY"),
    };

    setFormData({
      ...formData,
      category: "NU EAM",
      zuluDate: dayjs().format("YYYY-MM-DD"),
      time: dayjs().format("HHmm"),
    });

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
    fetchMNCSSchedule();
    fetchStations();
    fetchRxMedians();
    fetchMSGOriginators();
    fetchReportingCMD();
    fetchBroadcastingSchedule();
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
      action: `(S) RCVD ${eamData.preamble || "______"} VIA ${
        eamData.rxMedian || "______"
      } FROM ${eamData.msgOriginator || "______"}/ ${
        eamData.txOperator || "______"
      } @ ${eamData.txNcs || "______"} TOT ${
        eamData.timeOfTransit || "______"
      }Z/ HARD COPY MON BY: ${eamData.hardcopy || "_____"}/ MON BY: ${
        eamData.monitoredByFirst || "______"
      } & ${eamData.monitoredBySecond || "______"}/ ANCS AND ${
        eamData.gfncsOperator || "______"
      } @ GFNCS CONFIRMS THE FOLLOWING: ${stnfvrString}//`,
    }));
  }, [eamData, stations]);

  return (
    <>
      <Button onClick={onOpen} colorScheme="green">
        Form Builder
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW="50vw" bg="gray.900" color="white">
          <ModalHeader>NU EAM</ModalHeader>
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
                      {shiftMembers.map((member) => (
                        <option key={member.Id} value={member.initials}>
                          {member.initials} | {member.lastname}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem>
                    <Text>Preamble</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <HStack>
                      <PinInput
                        size="sm"
                        onChange={(val) =>
                          handleEAMDataChange({
                            target: { name: "preamble", value: val },
                          })
                        }
                        value={eamData.preamble}
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
                  </GridItem>
                  <GridItem>
                    <Text>Recieve Median</Text>
                  </GridItem>
                  <GridItem>
                    <Select
                      value={eamData.rxMedian}
                      name="rxMedian"
                      onChange={handleEAMDataChange}
                      size="sm"
                    >
                      {rxMedians.map((median) => (
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
                      value={eamData.msgOriginator}
                      name="msgOriginator"
                      onChange={handleEAMDataChange}
                      size="sm"
                    >
                      {msgOriginators.map((originator) => (
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
                      onChange={handleEAMDataChange}
                      value={eamData.txOperator}
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
                      value={eamData.txNcs}
                      name="txNcs"
                      onChange={handleEAMDataChange}
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
                      onChange={handleEAMDataChange}
                      value={eamData.timeOfTransit}
                      name="timeOfTransit"
                      type="text"
                      size="sm"
                    />
                  </GridItem>
                  <GridItem colSpan={2}></GridItem>
                  <GridItem>
                    <Text>Hard Copy Monitored By</Text>
                  </GridItem>
                  <GridItem>
                    <Input
                      onChange={handleEAMDataChange}
                      value={eamData.hardcopy}
                      name="hardcopy"
                      type="text"
                      size="sm"
                    />
                  </GridItem>
                  <GridItem colSpan={2}></GridItem>
                  <GridItem>
                    <Text>Monitored By</Text>
                  </GridItem>
                  <GridItem>
                    <Select
                      value={eamData.monitoredByFirst}
                      placeholder="Select an operator"
                      name="monitoredByFirst"
                      onChange={handleEAMDataChange}
                      size="sm"
                    >
                      {shiftMembers.map((member) => (
                        <option key={member.Id} value={member.initials}>
                          {member.initials} | {member.lastname}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem>
                    <Select
                      value={eamData.monitoredBySecond}
                      placeholder="Select an operator"
                      name="monitoredBySecond"
                      onChange={handleEAMDataChange}
                      size="sm"
                    >
                      {shiftMembers.map((member) => (
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
                      onChange={handleEAMDataChange}
                      value={eamData.gfncsOperator}
                      name="gfncsOperator"
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
                  {stations.map((station) => (
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

export default NuEAM;
