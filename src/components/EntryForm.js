import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { Textarea, Select, Input } from ".";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { EndRaday } from "./events";

const EntryForm = ({ setActionEntry, actionEntry, onSubmit, shift }) => {
  const [error, setError] = useState("");
  const [formBuilder, setFormBuilder] = useState(null);

  const eventCategoryOptions = [
    {
      id: uuidv4(),
      name: "END RADAY",
      component: (
        <EndRaday
          setActionEntry={setActionEntry}
          onSubmit={onSubmit}
          actionEntry={actionEntry}
          shift={shift}
        />
      ),
    },
  ];

  const handleCategoryChange = (e) => {
    setError("");
    setActionEntry((prevEntry) => ({ ...prevEntry, category: e.target.value }));

    const formBuilder = eventCategoryOptions.find(
      (option) => option.name === e.target.value
    );
    setFormBuilder(formBuilder.component);
  };

  const handleDateChange = (e) => {
    setError("");
    setActionEntry((prevEntry) => ({ ...prevEntry, zuluDate: e.target.value }));
  };

  const handleTimeChange = (e) => {
    setError("");
    if (e.target.value.length <= 4)
      setActionEntry((prevEntry) => ({ ...prevEntry, time: e.target.value }));
  };

  const handleOperatorInitialsChange = (e) => {
    setError("");
    setActionEntry((prevEntry) => ({
      ...prevEntry,
      operatorInitials: e.target.value,
    }));
  };

  const handleActionChange = (e) => {
    setError("");
    setActionEntry((prevEntry) => ({ ...prevEntry, action: e.target.value }));
  };

  const handleSave = () => {
    setError("");
    const zuluTimeRegEx = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);
    const timeValidation = zuluTimeRegEx.test(actionEntry.time);
    if (!timeValidation) return setError("You must enter a valid time.");
    if (!actionEntry.zuluDate) return setError("You must enter a date.");
    if (!actionEntry.operatorInitials)
      return setError("You must enter operator initials.");
    if (!actionEntry.action) return setError("You must enter an action.");
    if (!actionEntry.category) return setError("You must enter a category.");

    const entryObj = {
      ...actionEntry,
      zuluDate: dayjs(actionEntry.zuluDate).format("MM/DD/YYYY"),
    };

    setActionEntry({
      ...actionEntry,
      category: "",
      zuluDate: dayjs().format("YYYY-MM-DD"),
      time: dayjs().format("HHmm"),
      action: "",
    });

    console.log(entryObj);
    onSubmit(entryObj);
  };

  const clearError = () => {
    setError("");
  };

  const handleClear = () => {
    setError("");
    setActionEntry({
      ...actionEntry,
      category: "",
      zuluDate: dayjs().format("YYYY-MM-DD"),
      time: dayjs().format("HHmm"),
      action: "",
    });
  };
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
              <option key={option.id} value={option.name}>
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
          />
        </GridItem>
        <GridItem colSpan={2}>
          <Box display="flex" flexDir="row" alignItems="center">
            <FormLabel textAlign="right" ml={2}>
              Time
            </FormLabel>
            <Input
              onChange={handleTimeChange}
              value={actionEntry.time}
              type="number"
              isInvalid={error.match("time")}
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
        {formBuilder && <GridItem colStart={2}>{formBuilder}</GridItem>}
        <GridItem colStart={3}>
          <Button onClick={handleSave} mr={2} width="100%" colorScheme="blue">
            Save
          </Button>
        </GridItem>
        <GridItem>
          <Button onClick={handleClear} ml={2} width="100%" colorScheme="red">
            Clear
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
};
export default EntryForm;
