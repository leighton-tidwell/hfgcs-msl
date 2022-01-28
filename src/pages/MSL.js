import React, { useState, useEffect } from "react";
import DefaultLayout from "../layouts/Default";
import {
  Logo,
  EntryForm,
  EntryTable,
  SettingsModal,
  PrintModal,
  DatePicker,
} from "../components";
import { Box, useToast } from "@chakra-ui/react";
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
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const [actionEntry, setActionEntry] = useState({
    category: "",
    zuluDate: dayjs().format("YYYY-MM-DD"),
    time: "",
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
      action: entry.action.toUpperCase(),
    };

    try {
      const response = await insertIntoList("eventlog", formattedEntry);

      const entryWithId = {
        ...entry,
        action: entry.action.toUpperCase(),
        Id: response,
      };

      if (entry.zuluDate === date)
        setEntries((prevEntries) =>
          [...prevEntries, entryWithId].sort((a, b) => {
            if (a.time === b.time) return a.Id > b.Id ? 1 : -1;
            return a.time > b.time ? 1 : -1;
          })
        );
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });

      return false;
    }

    setActionEntry((prevEntry) => ({
      ...prevEntry,
      category: "",
      zuluDate: dayjs().format("YYYY-MM-DD"),
      time: "",
      action: "",
    }));

    return true;
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

    try {
      setEntries((prevEntries) =>
        prevEntries.map((e) => (e.Id === entry.Id ? formattedEntry : e))
      );
      await updateListItem("eventlog", entry);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const removeActionEntry = async (id) => {
    try {
      setEntries((prevEntries) => prevEntries.filter((e) => e.Id !== id));
      await removeFromList("eventlog", id);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const fetchEntries = async () => {
    setEntries([]);
    setLoading(true);

    try {
      const entries = await getActionsForDate(date);
      const formattedEntries = entries.map((entry) => ({
        category: entry.eventcategory,
        zuluDate: entry.entrydate,
        time: entry.entrytime,
        operatorInitials: entry.operatorinitials,
        action: entry.action,
        ...entry,
      }));

      const sortedEntries = formattedEntries.sort((a, b) => {
        if (a.time === b.time) return a.Id > b.Id ? 1 : -1;
        return a.time > b.time ? 1 : -1;
      });
      setEntries(sortedEntries);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }

    setLoading(false);
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
          flexGrow="1"
        >
          <Logo />
          <EntryForm
            setActionEntry={setActionEntry}
            actionEntry={actionEntry}
            onSubmit={submitActionEntry}
            shift={shift}
            changeCalendarDate={setDate}
          />
        </Box>
        <Box display="flex" flexBasis="60%" flexDir="column">
          <Box
            mb={2}
            textAlign="center"
            color="white"
            fontSize="lg"
            fontWeight="bold"
          >
            <DatePicker date={date} />
            <Box float="right">
              <SettingsModal />
              <PrintModal selectedDate={date} />
            </Box>
          </Box>
          <EntryTable
            updateEntry={updateActionEntry}
            removeEntry={removeActionEntry}
            date={date}
            entries={entries}
            loading={loading}
          />
        </Box>
      </Box>
    </DefaultLayout>
  );
};

export default MSLPage;
