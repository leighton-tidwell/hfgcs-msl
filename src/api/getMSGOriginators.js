import axios from "axios";

const sampleResults = [
  {
    Id: "1ex2555e",
    name: "AFSTRAT 48",
    default: "true",
    typediff: "eam",
  },
  {
    Id: "2ex2555e",
    name: "AIT CJCS NMCC",
    default: "false",
    typediff: "eam",
  },
  {
    Id: "3ex2555e",
    name: "301 IS",
    default: "false",
    typediff: "fox",
  },
  {
    Id: "4ex2555e",
    name: "303 IS",
    default: "true",
    typediff: "fox",
  },
];

const dev = process.env.NODE_ENV === "development";

const getMSGOriginators = async (type) => {
  try {
    if (dev) return sampleResults.filter((x) => x.typediff === type);

    const data = await axios.get(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('msgoriginator')/items`,
      {
        headers: {
          Accept: "application/json; odata=verbose",
        },
        withCredentials: true,
      }
    );

    const results = data.data.d.results;

    const filteredResults = results.filter((x) => x.typediff === type);

    return filteredResults;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default getMSGOriginators;
