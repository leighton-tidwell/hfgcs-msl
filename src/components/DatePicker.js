import React from "react";
import dayjs from "dayjs";

const DatePicker = ({ date }) => {
  return <>{dayjs(date).format("DD MMM YYYY")} </>;
};

export default DatePicker;
