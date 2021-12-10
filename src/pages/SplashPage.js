import React, { useEffect, useState } from "react";
import { Logo, ShiftSelect } from "../components";
import DefaultLayout from "../layouts/Default";
import { Box, Grid, Text } from "@chakra-ui/react";
import { getShifts } from "../api";

// const dayStaff = {
//   shiftName: "Day Staff",
//   shiftLead: "SSgt Rando",
//   operators: ["Sgt. Rando", "Sgt. Rando", "Sgt. Rando", "Sgt. Rando"],
// };

// const shifts = [
//   {
//     shiftName: "Alpha 1",
//     shiftLead: "SSgt Rando",
//     operators: [
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//     ],
//   },
//   {
//     shiftName: "Alpha 2",
//     shiftLead: "SSgt Rando",
//     operators: [
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//     ],
//   },
//   {
//     shiftName: "Alpha 3",
//     shiftLead: "SSgt Rando",
//     operators: [
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//     ],
//   },
//   {
//     shiftName: "Alpha 4",
//     shiftLead: "SSgt Rando",
//     operators: [
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//       "Sgt. Rando",
//     ],
//   },
// ];

// const alphaOne = {
//   shiftLead: "SSgt Dingus",
//   operators: ["Sgt. Dingus", "Sgt. Dingus", "Sgt. Dingus"],
// };

const SplashPage = ({ setShift }) => {
  const [shifts, setShifts] = useState(null);
  const [dayShift, setDayShift] = useState(null);

  const fetchShifts = async () => {
    const data = await getShifts();
    const filteredShifts = data.filter((shift) => shift.isDayShift === "false");
    setShifts(filteredShifts);

    const dayShiftName = data.filter((shift) => shift.isDayShift === "true")[0];
    setDayShift(dayShiftName.name);
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return (
    <DefaultLayout>
      <Box display="flex">
        <Logo />
        {dayShift && (
          <ShiftSelect
            onClick={() => setShift(dayShift)}
            shiftName={dayShift}
          />
        )}
      </Box>
      <Box mt={100}>
        <Text color="white" fontSize="xl" fontWeight="600" textAlign="center">
          Select A Shift
        </Text>
        <Grid templateColumns="repeat(4, 1fr)" gap={15} mt={5}>
          {shifts &&
            shifts.map((shift, index) => (
              <ShiftSelect
                onClick={() => setShift(shift.name)}
                shiftName={shift.name}
                key={index}
              />
            ))}
        </Grid>
      </Box>
    </DefaultLayout>
  );
};

export default SplashPage;
