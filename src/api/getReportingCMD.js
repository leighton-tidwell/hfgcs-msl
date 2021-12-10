import axios from "axios";

const sampleResults = [
  {
    Id: "1ex26868e",
    name: "PACROC",
    default: "true",
  },
  {
    Id: "2ex26868e",
    name: "613 AOC",
    default: "false",
  },
];

const dev = process.env.NODE_ENV === "development";

const getReportingCMD = async (type) => {
  try {
    if (dev) return sampleResults;

    const data = await axios.get(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('reportingcmd')/items`,
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

export default getReportingCMD;
