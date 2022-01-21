import React, { useState, useEffect } from "react";
import { Box, Text, Button, FormControl, FormLabel } from "@chakra-ui/react";
import { Input } from ".";
import ExcelJS from "exceljs/dist/es5/exceljs.browser.js";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { getActionsForRange } from "../api";

const ExportEvents = () => {
  const [startDate, setStartDate] = useState(
    dayjs().subtract(2, "week").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const handleChangeStartDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleChangeEndDate = (e) => {
    setEndDate(e.target.value);
  };

  const generateReport = async () => {
    const formattedStartDate = dayjs(startDate).format("MM/DD/YYYY");
    const formattedEndDate = dayjs(endDate).format("MM/DD/YYYY");

    const events = await getActionsForRange(
      formattedStartDate,
      formattedEndDate
    );

    const sortedEvents = events.sort((a, b) =>
      dayjs(a.entrydate).unix() > dayjs(b.entrydate).unix() ? 1 : -1
    );

    const sortedByTime = sortedEvents.sort((a, b) => {
      if (a.entrydate === b.entrydate)
        return a.entrytime > b.entrytime ? 1 : -1;
    });

    const wb = new ExcelJS.Workbook();

    const ws = wb.addWorksheet();

    ws.columns = [
      { key: "1", width: 150 },
      { key: "2", width: 15 },
      { key: "3", width: 10 },
      { key: "4", width: 50 },
      { key: "5", width: 20 },
    ];

    ws.addRow([
      "ACTION",
      "ENTRY DATE",
      "ENTRY TIME",
      "EVENT CATEGORY",
      "OP INIT",
    ]);

    sortedByTime.forEach((event) => {
      ws.addRow([
        event.action,
        event.entrydate,
        event.entrytime,
        event.eventcategory,
        event.operatorinitials,
      ]);
    });

    const buf = await wb.xlsx.writeBuffer();

    saveAs(
      new Blob([buf]),
      `${dayjs(startDate).format("DD")}-${dayjs(endDate)
        .format("DD MMM")
        .toUpperCase()} MSL.xlsx`
    );
  };

  return (
    <Box display="flex">
      <Box flexGrow="1" mr={2} display="flex" flexDir="column">
        <Box mb={3} display="flex" flexDir="column">
          <Text fontWeight="bold" fontSize="lg" flexGrow="1">
            Export Events:
          </Text>
          <FormControl mb={2} isRequired>
            <FormLabel>Start Date</FormLabel>
            <Input
              name="startDate"
              onChange={handleChangeStartDate}
              value={startDate}
              type="date"
            />
          </FormControl>
          <FormControl mb={2} isRequired>
            <FormLabel>End Date</FormLabel>
            <Input
              name="endDate"
              onChange={handleChangeEndDate}
              value={endDate}
              type="date"
            />
          </FormControl>
        </Box>
        <Button
          onClick={generateReport}
          colorScheme="blue"
          width="300px"
          mr={2}
        >
          Export Events
        </Button>
      </Box>
    </Box>
  );
};

export default ExportEvents;
