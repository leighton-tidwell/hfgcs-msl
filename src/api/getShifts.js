import axios from "axios";

const sampleData = [
  {
    Id: "1eeeeee",
    name: "OFFICE HOURS",
    isDayShift: "true",
  },
  {
    Id: "2eeeeee",
    name: "BRAVO 1",
    isDayShift: "false",
  },
  {
    Id: "3eeeeee",
    name: "BRAVO 2",
    isDayShift: "false",
  },
  {
    Id: "4eeeeee",
    name: "ALPHA 1",
    isDayShift: "false",
  },
  {
    Id: "5eeeeee",
    name: "ALPHA 2",
    isDayShift: "false",
  },
];

const dev = process.env.NODE_ENV === "development";

const getShifts = async () => {
  try {
    if (dev) return sampleData;

    const data = await axios.get(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('shift')/items`,
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

export default getShifts;
