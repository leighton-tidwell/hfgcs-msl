import axios from "axios";

const sampleResults = [
  {
    Id: "1ee3e",
    ncs: "ANCS",
    months: "1,3,5,7,9,11",
  },
  {
    Id: "2ee3e",
    ncs: "GFNCS",
    months: "2,4,6,8,10,12",
  },
];

const dev = process.env.NODE_ENV === "development";

const getMNCSSchedule = async () => {
  try {
    if (dev) return sampleResults;

    const data = await axios.get(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('mncsschedule')/items`,
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

export default getMNCSSchedule;
