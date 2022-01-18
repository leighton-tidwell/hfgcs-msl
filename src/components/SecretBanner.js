import React, { useEffect, useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { getBroadcastingSchedule } from "../api";
import dayjs from "dayjs";

const SecretBanner = () => {
  const [currentBroadcastSchedule, setCurrentBroadcastSchedule] = useState([]);
  const [currentTxNcs, setCurrentTxNcs] = useState("");
  const [raday, setRaday] = useState(false);
  const toast = useToast();

  const fetchBroadcastingSchedule = async () => {
    const broadcastingSchedule = await getBroadcastingSchedule();
    const formattedBroadcastSchedule = broadcastingSchedule
      .map((schedule) => ({
        time: schedule.time,
        ncs: schedule.ncs,
        Id: schedule.Id,
      }))
      .sort((a, b) => (a.time > b.time ? 1 : -1));

    setCurrentBroadcastSchedule(formattedBroadcastSchedule);
  };

  const checkCurrentBroadcastNcs = () => {
    const currentTime = dayjs().format("HHmm");

    for (let i = 0; i < currentBroadcastSchedule.length; i++) {
      if (
        currentTime > currentBroadcastSchedule[i].time &&
        currentTime < currentBroadcastSchedule[i + 1].time
      ) {
        setCurrentTxNcs(currentBroadcastSchedule[i].ncs);
        break;
      }

      if (
        currentTime > currentBroadcastSchedule[i].time &&
        currentBroadcastSchedule[i + 1] === undefined
      ) {
        setCurrentTxNcs(currentBroadcastSchedule[i].ncs);
        break;
      }
    }
  };

  const checkRaday = () => {
    const currentTime = dayjs().format("HHmm");
    if (currentTime === "0000" && raday === false) {
      return setRaday(true);
    }

    if (raday === true && currentTime !== "0000") {
      return setRaday(false);
    }
  };

  useEffect(() => {
    fetchBroadcastingSchedule();
    const timer = setTimeout(() => {
      checkCurrentBroadcastNcs();
      checkRaday();
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentTxNcs !== "")
      toast({
        title: `Current TX NCS: ${currentTxNcs}`,
        position: "top",
        status: "warning",
        isClosable: true,
        duration: 3600000,
      });
  }, [currentTxNcs]);

  useEffect(() => {
    if (raday === true)
      toast({
        title: "RADAY",
        position: "top",
        status: "error",
        duration: 3600000,
        isClosable: true,
      });
  }, [raday]);

  return (
    <Box
      textAlign="center"
      fontWeight="700"
      bg="red"
      color="white"
      width="100%"
      p={1}
    >
      SECRET
    </Box>
  );
};

export default SecretBanner;
