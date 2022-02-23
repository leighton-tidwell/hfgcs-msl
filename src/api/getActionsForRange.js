import axios from "axios";
import dayjs from "dayjs";

const sampleResults = [
  {
    Id: "1eeee",
    eventcategory: "SHIFT CHANGE (ON DUTY)",
    entrydate: dayjs().format("MM/DD/YYYY"),
    entrytime: "1256",
    operatorinitials: "JT",
    action:
      "(U) A lot of random stuff that goes here and I won't actually bother typing the correct stuff. ATT/ random stuff after this hello",
  },
  {
    Id: "2eeee",
    eventcategory: "NU RADAY",
    entrydate: dayjs().format("MM/DD/YYYY"),
    entrytime: "1456",
    operatorinitials: "JT",
    action:
      "(U) A lot of random stuff that goes here and I won't actually bother typing the correct stuff.",
  },
  {
    Id: "22eeee",
    eventcategory: "NU RADAY",
    entrydate: dayjs().format("MM/DD/YYYY"),
    entrytime: "1000",
    operatorinitials: "JT",
    action:
      "(U) A lot of random stuff that goes here and I won't actually bother typing the correct stuff.",
  },
  {
    Id: "3eeee",
    eventcategory: "CHKLST NOTE - 102 (END)",
    entrydate: dayjs().subtract(1, "day").format("MM/DD/YYYY"),
    entrytime: "2200",
    operatorinitials: "JT",
    action:
      "(U) A lot of random stuff that goes here and I won't actually bother typing the correct stuff. ATT/ random stuff after this hello",
  },
  {
    Id: "4eeee",
    eventcategory: "CHKLST NOTE - 102 (END)",
    entrydate: dayjs().subtract(5, "day").format("MM/DD/YYYY"),
    entrytime: "2200",
    operatorinitials: "JT",
    action:
      "(U) A lot of random stuff that goes here and I won't actually bother typing the correct stuff. ATT/ random stuff after this hello",
  },
  {
    Id: "5eeee",
    eventcategory: "CHKLST NOTE - 102 (END)",
    entrydate: dayjs().subtract(10, "day").format("MM/DD/YYYY"),
    entrytime: "2200",
    operatorinitials: "JT",
    action:
      "(U) A lot of random stuff that goes here and I won't actually bother typing the correct stuff. ATT/ random stuff after this hello",
  },
  {
    Id: "6eeee",
    eventcategory: "CHKLST NOTE - 102 (END)",
    entrydate: dayjs().subtract(6, "day").format("MM/DD/YYYY"),
    entrytime: "2200",
    operatorinitials: "JT",
    action:
      "(U) A lot of random stuff that goes here and I won't actually bother typing the correct stuff. ATT/ random stuff after this hello",
  },
];

const dev = process.env.NODE_ENV === "development";

const getActionsForRange = async (startDate, endDate) => {
  try {
    if (dev)
      return sampleResults.filter(
        (result) => result.entrydate <= endDate && result.entrydate >= startDate
      );

    const startDateObject = dayjs(startDate);
    let cloneStartDateObject = dayjs(startDate);
    const endDateObject = dayjs(endDate);

    let results = [];
    if (startDateObject.month() !== endDateObject.month()) {
      while (true) {
        let data;
        let breakOut = false;
        if (startDateObject === cloneStartDateObject) {
          const startCloneObject = cloneStartDateObject.format("MM/DD/YYYY");
          const endOfMonth = cloneStartDateObject
            .endOf("month")
            .format("MM/DD/YYYY");

          data = await axios.get(
            `${process.env.REACT_APP_API}/web/lists/getbytitle('eventlog')/items?$filter=entrydate ge '${startCloneObject}' and entrydate le '${endOfMonth}'&$top=5000`,
            {
              headers: {
                Accept: "application/json; odata=verbose",
              },
              withCredentials: true,
            }
          );
        } else if (endDateObject.month() === cloneStartDateObject.month()) {
          const startOfMonth = cloneStartDateObject
            .startOf("month")
            .format("MM/DD/YYYY");

          data = await axios.get(
            `${
              process.env.REACT_APP_API
            }/web/lists/getbytitle('eventlog')/items?$filter=entrydate ge '${startOfMonth}' and entrydate le '${endDateObject.format(
              "MM/DD/YYYY"
            )}'&top=5000`,
            {
              headers: {
                Accept: "application/json; odata=verbose",
              },
              withCredentials: true,
            }
          );
          breakOut = true;
        } else {
          const startOfMonth = cloneStartDateObject
            .startOf("month")
            .format("MM/DD/YYYY");
          const endOfMonth = cloneStartDateObject
            .endOf("month")
            .format("MM/DD/YYYY");

          data = await axios.get(
            `${process.env.REACT_APP_API}/web/lists/getbytitle('eventlog')/items?$filter=entrydate ge '${startOfMonth}' and entrydate le '${endOfMonth}'&top=5000`,
            {
              headers: {
                Accept: "application/json; odata=verbose",
              },
              withCredentials: true,
            }
          );
        }
        results = results.concat(data.data.d.results);
        if (breakOut) break;
        cloneStartDateObject = cloneStartDateObject.add(1, "month");
      }
    } else {
      const data = await axios.get(
        `${process.env.REACT_APP_API}/web/lists/getbytitle('eventlog')/items?$filter=entrydate le '${endDate}' and entrydate ge '${startDate}'&top=5000`,
        {
          headers: {
            Accept: "application/json; odata=verbose",
          },
          withCredentials: true,
        }
      );
      results = data.data.d.results;
    }

    return results;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default getActionsForRange;
