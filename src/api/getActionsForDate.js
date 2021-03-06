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
    Id: "3eeee",
    eventcategory: "CHKLST NOTE - 102 (END)",
    entrydate: dayjs().subtract(1, "day").format("MM/DD/YYYY"),
    entrytime: "2200",
    operatorinitials: "JT",
    action:
      "(U) A lot of random stuff that goes here and I won't actually bother typing the correct stuff. ATT/ random stuff after this hello",
  },
];

const dev = process.env.NODE_ENV === "development";

const getActionsForDate = async (date) => {
  try {
    if (dev) return sampleResults.filter((result) => result.entrydate === date);

    const data = await axios.get(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('eventlog')/items?$filter=entrydate eq '${date}'&$top=5000`,
      {
        headers: {
          Accept: "application/json; odata=verbose",
        },
        withCredentials: true,
      }
    );

    const results = data.data.d.results;

    return results;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default getActionsForDate;
