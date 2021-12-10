import React, { useState, useEffect } from "react";
import DefaultLayout from "../layouts/Default";
import {
  Logo,
  EntryForm,
  EntryTable,
  SettingsModal,
  PrintIcon,
  DatePicker,
} from "../components";
import { Box } from "@chakra-ui/react";
import {
  insertIntoList,
  getActionsForDate,
  updateListItem,
  removeFromList,
} from "../api";
import dayjs from "dayjs";

const MSLPage = ({ shift }) => {
  const [date, setDate] = useState(dayjs().format("MM/DD/YYYY"));
  const [entries, setEntries] = useState([]);

  const [actionEntry, setActionEntry] = useState({
    category: "",
    zuluDate: dayjs().format("YYYY-MM-DD"),
    time: dayjs().format("HHmm"),
    operatorInitials: "",
    action: "",
  });

  const submitActionEntry = async (entry) => {
    // format to sharepoint API format
    const formattedEntry = {
      eventcategory: entry.category,
      entrydate: entry.zuluDate,
      entrytime: entry.time,
      operatorinitials: entry.operatorInitials,
      action: entry.action,
    };

    const response = await insertIntoList("eventlog", formattedEntry);

    const entryWithId = {
      ...entry,
      Id: response,
    };

    setEntries((prevEntries) =>
      [...prevEntries, entryWithId].sort((a, b) => (a.time > b.time ? 1 : -1))
    );
  };

  const updateActionEntry = async (entry) => {
    // format back to state format
    const formattedEntry = {
      category: entry.eventcategory,
      zuluDate: entry.entrydate,
      time: entry.entrytime,
      operatorInitials: entry.operatorinitials,
      action: entry.action,
      ...entry,
    };

    const response = await updateListItem("eventlog", entry);

    setEntries((prevEntries) =>
      prevEntries.map((e) => (e.Id === entry.Id ? formattedEntry : e))
    );
  };

  const removeActionEntry = async (id) => {
    const response = await removeFromList("eventlog", id);

    setEntries((prevEntries) => prevEntries.filter((e) => e.Id !== id));
  };

  const fetchEntries = async () => {
    const entries = await getActionsForDate(date);
    const formattedEntries = entries.map((entry) => ({
      category: entry.eventcategory,
      zuluDate: entry.entrydate,
      time: entry.entrytime,
      operatorInitials: entry.operatorinitials,
      action: entry.action,
      ...entry,
    }));

    const sortedEntries = formattedEntries.sort((a, b) =>
      a.time > b.time ? 1 : -1
    );

    setEntries(sortedEntries);
  };

  const updateDate = (date) => {
    setDate(date);
  };

  useEffect(() => {
    fetchEntries();
  }, [date]);

  return (
    <DefaultLayout>
      <Box display="flex" flexDir="row" height="95%">
        <Box
          display="flex"
          maxWidth="40%"
          maxHeight="500px"
          mr={10}
          flexDir="column"
        >
          <Logo />
          <EntryForm
            setActionEntry={setActionEntry}
            actionEntry={actionEntry}
            onSubmit={submitActionEntry}
          />
        </Box>
        <Box display="flex" flexGrow="1" flexDir="column">
          <Box
            mb={2}
            textAlign="center"
            color="white"
            fontSize="lg"
            fontWeight="bold"
          >
            <DatePicker onChange={updateDate} date={date} />
            <Box float="right">
              <SettingsModal />
              <PrintIcon />
            </Box>
          </Box>
          <EntryTable
            updateEntry={updateActionEntry}
            removeEntry={removeActionEntry}
            date={date}
            entries={entries}
            shift={shift}
          />
        </Box>
      </Box>
    </DefaultLayout>
  );
};

export default MSLPage;
