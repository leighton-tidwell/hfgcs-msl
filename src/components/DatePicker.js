import React, { useState } from "react";
import { EditIcon, Input } from ".";
import { Box, Link } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";

const DatePicker = ({ date, onChange }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [newDate, setNewDate] = useState(dayjs(date).format("YYYY-MM-DD"));

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleDateChange = (e) => {
    setNewDate(e.target.value);
  };

  const handleSaveDate = () => {
    onChange(dayjs(newDate).format("MM/DD/YYYY"));
    setIsEditable(false);
  };

  return (
    <>
      {isEditable ? (
        <Box
          minWidth="200px"
          maxWidth="300px"
          margin="0 auto"
          display="flex"
          alignItems="center"
        >
          <Input value={newDate} onChange={handleDateChange} type="date" />
          <Link ml={2}>
            <CheckIcon onClick={handleSaveDate} height="25px" width="25px" />
          </Link>
        </Box>
      ) : (
        <>
          {dayjs(date).format("DD MMM YYYY")}{" "}
          <Link onClick={toggleEdit}>
            <EditIcon />
          </Link>
        </>
      )}
    </>
  );
};

export default DatePicker;
