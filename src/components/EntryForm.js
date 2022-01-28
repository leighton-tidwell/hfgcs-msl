import React, { useState, useEffect } from "react";
import {
  Grid,
  GridItem,
  FormLabel,
  Box,
  Button,
  CloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
} from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import { Textarea, Select, Input } from ".";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import {
  EndRaday,
  ShiftChangeOffDuty,
  ShiftChangeOnDuty,
  Checklist101End,
  Checklist108End,
  FoxFairly,
  NuEAM,
  BeginNuRaday,
  DefconStatus,
  NetNote,
  QueueStatus,
  StnNote,
  TfcNote,
} from "./events";

const EntryForm = ({
  setActionEntry,
  actionEntry,
  onSubmit,
  shift,
  changeCalendarDate,
}) => {
  const [error, setError] = useState("");
  const [formBuilder, setFormBuilder] = useState(null);
  const [loading, setLoading] = useState(false);

  const eventCategoryOptions = [
    {
      id: uuidv4(),
      name: "END RADAY",
      component: (
        <EndRaday actionEntry={actionEntry} onSubmit={onSubmit} shift={shift} />
      ),
    },
    {
      id: uuidv4(),
      name: "SHIFT CHANGE (OFF DUTY)",
      component: (
        <ShiftChangeOffDuty
          actionEntry={actionEntry}
          onSubmit={onSubmit}
          shift={shift}
        />
      ),
    },
    {
      id: uuidv4(),
      name: "CHKLST NOTE - 101 (END)",
      component: (
        <Checklist101End
          actionEntry={actionEntry}
          onSubmit={onSubmit}
          shift={shift}
        />
      ),
    },
    {
      id: uuidv4(),
      name: "CHKLST NOTE - 108 (END)",
      component: (
        <Checklist108End
          actionEntry={actionEntry}
          onSubmit={onSubmit}
          shift={shift}
        />
      ),
    },
    {
      id: uuidv4(),
      name: "BEGIN NU RAYDAY",
      component: (
        <BeginNuRaday
          actionEntry={actionEntry}
          onSubmit={onSubmit}
          shift={shift}
        />
      ),
    },
    {
      id: uuidv4(),
      name: "SHIFT CHANGE (ON DUTY)",
      component: (
        <ShiftChangeOnDuty
          actionEntry={actionEntry}
          onSubmit={onSubmit}
          shift={shift}
        />
      ),
    },
    {
      id: uuidv4(),
      name: "FOX FAIRLY",
      component: (
        <FoxFairly
          actionEntry={actionEntry}
          onSubmit={onSubmit}
          shift={shift}
        />
      ),
    },
    {
      id: uuidv4(),
      name: "NU EAM",
      component: (
        <NuEAM actionEntry={actionEntry} onSubmit={onSubmit} shift={shift} />
      ),
    },
    {
      id: uuidv4(),
      name: "ANCS NOTE",
      component: null,
      template: "(U) OPS NORMAL ATT//",
    },
    {
      id: uuidv4(),
      name: "CHKLST NOTE - 101 (START)",
      component: null,
      template:
        "(U) OPERATORS HAVE STARTED THEIR SHIFT CHANGE STN OPS CHECKS ATT//",
    },
    {
      id: uuidv4(),
      name: "CHKLST NOTE - 108 (START)",
      component: null,
      template: "(U) OPERATORS HAVE STARTED THEIR 4 HOUR STN OPS CHECKS ATT//",
    },
    {
      id: uuidv4(),
      name: "CHKLST NOTE - 301 (END)",
      component: null,
      template:
        "(U) COORDINATORS HAVE COMPLETED THE CROWS NEST SHIFT CHANGE CHECKLIST ATT//",
    },
    {
      id: uuidv4(),
      name: "CHKLST NOTE - 301 (START)",
      component: null,
      template:
        "(U) COORDINATORS HAVE STARTED THE CROWS NEST SHIFT CHANGE CHECKLIST ATT//",
    },
    {
      id: uuidv4(),
      name: "CHKLST NOTE - 302 (END)",
      component: null,
      template: "(U) COORDINATORS HAVE COMPLETED THE HF DATA CHECKLIST ATT//",
    },
    {
      id: uuidv4(),
      name: "RADAY CHECKLIST (END)",
      component: null,
      template: "(U) OPERATORS HAVE COMPLETED THE RADAY CHECKLIST ATT//",
    },
    {
      id: uuidv4(),
      name: "RADAY CHECKLIST (START)",
      component: null,
      template: "(U) OPERATORS HAVE STARTED THE RADAY CHECKLIST ATT//",
    },
    {
      id: uuidv4(),
      name: "CHKLST NOTE - CSA",
      component: null,
      template: "(U) HFGCS CSA HAS BEEN UPDATED AND SENT ATT//",
    },
    {
      id: uuidv4(),
      name: "CHKLST NOTE - HF DATA (START)",
      component: null,
      template: "(U) COORDINATORS HAVE STARTED THE HF DATA CHECKLIST ATT//",
    },
    {
      id: uuidv4(),
      name: "CHKLST NOTE - HF DATA (END)",
      component: null,
      template:
        "(U) _ ATTEMPTED HF DATA TEST ATT/ CHECK [SUCCESSFUL/UNSUCCESSFUL] ON FQCY _____ USING STN _//",
    },
    {
      id: uuidv4(),
      name: "CHKLST NOTE - CHAT",
      component: null,
      template: "(U) _ LOGGED INTO CHATSURFER CHATROOM ATT//",
    },
    {
      id: uuidv4(),
      name: "PERIMETER CHECK",
      component: null,
      template: "(U) PERIMETER CHECK ATT//",
    },
    {
      id: uuidv4(),
      name: "BLIND NET NOTE",
      component: null,
      template:
        "(U) __ [ENTERED/EXITED] THE NET BLIND ATT/ _ @ _ WAS CHALLENGED WITH _//",
    },
    {
      id: uuidv4(),
      name: "BROTHER",
      component: null,
      template: "(U) //",
    },
    {
      id: uuidv4(),
      name: "CHKLST NOTE - SECVOC",
      component: null,
      template:
        "(U) _ ATTEMPTED SECURE VOICE CHECK ATT/ CHECK [SUCCESSFUL/UNSUCCESSFUL] ON FQCY _____ //",
    },
    {
      id: uuidv4(),
      name: "HARVARD",
      component: null,
      template:
        "(U) RCVD HARVARD REPORT FROM _/[INSERT NAUTICAL MILES OFFSHORE IN INTERNATIONAL AIRSPACE] ATT//",
    },
    {
      id: uuidv4(),
      name: "DEFCON STATUS",
      component: (
        <DefconStatus
          actionEntry={actionEntry}
          onSubmit={onSubmit}
          shift={shift}
        />
      ),
      template: null,
    },
    {
      id: uuidv4(),
      name: "NET NOTE",
      component: (
        <NetNote actionEntry={actionEntry} onSubmit={onSubmit} shift={shift} />
      ),
      template: null,
    },
    {
      id: uuidv4(),
      name: "QUEUE STATUS",
      component: (
        <QueueStatus
          actionEntry={actionEntry}
          onSubmit={onSubmit}
          shift={shift}
        />
      ),
      template: null,
    },
    {
      id: uuidv4(),
      name: "STN NOTE",
      component: (
        <StnNote actionEntry={actionEntry} onSubmit={onSubmit} shift={shift} />
      ),
      template: null,
    },
    {
      id: uuidv4(),
      name: "TFC NOTE",
      component: (
        <TfcNote actionEntry={actionEntry} onSubmit={onSubmit} shift={shift} />
      ),
      template: null,
    },
  ].sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  const handleCategoryChange = (e) => {
    setError("");
    setActionEntry((prevEntry) => ({ ...prevEntry, category: e.target.value }));

    const categorySettings = eventCategoryOptions.find(
      (option) => option.name === e.target.value
    );
    if (!categorySettings) return setFormBuilder(null);
    if (categorySettings.template) {
      setActionEntry((prevEntry) => ({
        ...prevEntry,
        action: categorySettings.template,
      }));
      setFormBuilder(null);
      return;
    }
    setFormBuilder(categorySettings.component);
    setActionEntry((prevEntry) => ({ ...prevEntry, action: "" }));
  };

  const handleDateChange = (e) => {
    setError("");
    setActionEntry((prevEntry) => ({ ...prevEntry, zuluDate: e.target.value }));
    changeCalendarDate(dayjs(e.target.value).format("MM/DD/YYYY"));
  };

  const handleTimeChange = (e) => {
    setError("");
    if (e.target.value.length <= 4)
      setActionEntry((prevEntry) => ({
        ...prevEntry,
        time: e.target.value.replace(/[^0-9]/g, ""),
      }));
  };

  const handleOperatorInitialsChange = (e) => {
    setError("");
    setActionEntry((prevEntry) => ({
      ...prevEntry,
      operatorInitials: e.target.value.toUpperCase(),
    }));
  };

  const handleActionChange = (e) => {
    setError("");
    setActionEntry((prevEntry) => ({
      ...prevEntry,
      action: e.target.value.toUpperCase(),
    }));
  };

  const handleSave = async () => {
    setError("");
    const zuluTimeRegEx = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);
    const timeValidation = zuluTimeRegEx.test(actionEntry.time);
    if (!timeValidation) return setError("You must enter a valid time.");
    if (!actionEntry.zuluDate) return setError("You must enter a date.");
    if (!actionEntry.operatorInitials)
      return setError("You must enter operator initials.");
    if (!actionEntry.action) return setError("You must enter an action.");
    if (!actionEntry.category) return setError("You must enter a category.");
    setLoading(true);

    const entryObj = {
      ...actionEntry,
      action: actionEntry.action.toUpperCase(),
      zuluDate: dayjs(actionEntry.zuluDate).format("MM/DD/YYYY"),
    };

    await onSubmit(entryObj);

    setActionEntry({
      ...actionEntry,
      category: "",
      zuluDate: dayjs().format("YYYY-MM-DD"),
      time: dayjs().format("HHmm"),
      action: "",
    });

    setLoading(false);
  };

  const clearError = () => {
    setError("");
    setLoading(false);
  };

  const handleClear = () => {
    setError("");
    setActionEntry({
      ...actionEntry,
      category: "",
      time: "",
      action: "",
    });
    setFormBuilder(null);
  };

  const refreshTime = () => {
    setActionEntry((prevEntry) => ({
      ...prevEntry,
      zuluDate: dayjs().format("YYYY-MM-DD"),
      time: dayjs().format("HHmm"),
    }));
  };

  useEffect(() => {
    setActionEntry(actionEntry);
    if (actionEntry.category === "") setFormBuilder(null);
  }, [actionEntry]);

  return (
    <Box mt={10} bg="gray.800" p={10} color="white" rounded="sm">
      <Grid templateColumns="repeat(4, 1fr)" rowGap={6}>
        <GridItem>
          <FormLabel textAlign="right">Event Category</FormLabel>
        </GridItem>
        <GridItem colSpan={3}>
          <Select
            isInvalid={error.match("category")}
            onChange={handleCategoryChange}
            value={actionEntry.category}
            placeholder="Select an event category"
          >
            {eventCategoryOptions.map((option) => (
              <option
                style={{ color: "black" }}
                key={option.id}
                value={option.name}
              >
                {option.name}
              </option>
            ))}
          </Select>
        </GridItem>
        <GridItem>
          <FormLabel textAlign="right">Zulu Date</FormLabel>
        </GridItem>
        <GridItem>
          <Input
            onChange={handleDateChange}
            value={actionEntry.zuluDate}
            type="date"
            isInvalid={error.match("date")}
            isDisabled={formBuilder !== null}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <Box display="flex" flexDir="row" alignItems="center">
            <Box
              ml={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box mr={2}>Time</Box>
              <Box mr={2} cursor="pointer" onClick={refreshTime}>
                <RepeatClockIcon />
              </Box>
            </Box>
            <Input
              onChange={handleTimeChange}
              value={actionEntry.time}
              type="text"
              isInvalid={error.match("time")}
              isDisabled={formBuilder !== null}
            />
          </Box>
        </GridItem>
        <GridItem>
          <FormLabel textAlign="right">Op Init</FormLabel>
        </GridItem>
        <GridItem>
          <Input
            onChange={handleOperatorInitialsChange}
            value={actionEntry.operatorInitials}
            type="text"
            isInvalid={error.match("initials")}
            isDisabled={formBuilder !== null}
          />
        </GridItem>
        <GridItem colSpan={2}></GridItem>
        <GridItem>
          <FormLabel textAlign="right">Action/Event</FormLabel>
        </GridItem>
        <GridItem colSpan={3}>
          <Textarea
            isInvalid={error.match("action")}
            onChange={handleActionChange}
            value={actionEntry.action}
            isDisabled={formBuilder !== null}
          />
        </GridItem>
        <GridItem colSpan={4}>
          {error && (
            <Alert status="error" variant="solid">
              <AlertIcon />
              <AlertTitle mr={2}>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <CloseButton
                onClick={clearError}
                position="absolute"
                right="8px"
                top="8px"
              />
            </Alert>
          )}
        </GridItem>
        <GridItem colStart={3}>
          {formBuilder ? (
            formBuilder
          ) : (
            <Button
              disabled={loading}
              onClick={handleSave}
              mr={2}
              width="100%"
              colorScheme="blue"
            >
              {loading ? <Spinner size="sm" /> : "Save"}
            </Button>
          )}
        </GridItem>
        <GridItem>
          <Button
            disabled={loading}
            onClick={handleClear}
            ml={2}
            width="100%"
            colorScheme="red"
          >
            Clear
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
};
export default EntryForm;
