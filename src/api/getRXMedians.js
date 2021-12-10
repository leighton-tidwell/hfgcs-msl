import axios from "axios";

const sampleResults = [
  {
    Id: "1ex2333e",
    name: "HF",
    default: "false",
    typediff: "eam",
  },
  {
    Id: "2ex2333e",
    name: "LL",
    default: "true",
    typediff: "eam",
  },
  {
    Id: "3ex2333e",
    name: "HF",
    default: "true",
    typediff: "fox",
  },
  {
    Id: "4ex2333e",
    name: "LL",
    default: "false",
    typediff: "fox",
  },
];

const dev = process.env.NODE_ENV === "development";

const getRXMedians = async (type) => {
  try {
    if (dev) return sampleResults.filter((x) => x.typediff === type);

    const data = await axios.get(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('rxmedian')/items`,
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

export default getRXMedians;
