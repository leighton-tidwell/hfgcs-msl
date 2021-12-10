import axios from "axios";
import dayjs from "dayjs";

const sampleResults = [
  {
    Id: "1eeee",
    eventcategory: "option1",
    entrydate: dayjs().format("MM/DD/YYYY"),
    entrytime: "1256",
    operatorinitials: "JT",
    action:
      "(U) A lot of random stuff that goes here and I won't actually bother typing the correct stuff.",
  },
  {
    Id: "2eeee",
    eventcategory: "option1",
    entrydate: dayjs().format("MM/DD/YYYY"),
    entrytime: "1456",
    operatorinitials: "JT",
    action:
      "(U) A lot of random stuff that goes here and I won't actually bother typing the correct stuff.",
  },
  {
    Id: "3eeee",
    eventcategory: "option1",
    entrydate: dayjs().format("MM/DD/YYYY"),
    entrytime: "2055",
    operatorinitials: "JT",
    action:
      "(U) A lot of random stuff that goes here and I won't actually bother typing the correct stuff.",
  },
];

const dev = process.env.NODE_ENV === "development";

const getAction = async (id) => {
  try {
    if (dev) return sampleResults.filter((result) => result.Id === id);

    const data = await axios.get(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('eventlog')/items?$filter=Id eq '${id}'`,
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

export default getAction;
