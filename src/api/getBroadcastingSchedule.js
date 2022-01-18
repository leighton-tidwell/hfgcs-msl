import axios from "axios";

const sampleResults = [
  {
    Id: "1ee2e",
    time: "0600",
    ncs: "GFNCS",
  },
  {
    Id: "2ee2e",
    time: "1200",
    ncs: "ANCS",
  },
  {
    Id: "3ee2e",
    time: "1800",
    ncs: "GFNCS",
  },
  {
    Id: "4ee2e",
    time: "0000",
    ncs: "ANCS",
  },
];

const dev = process.env.NODE_ENV === "development";

const getBroadcastingSchedule = async () => {
  try {
    if (dev) return sampleResults;

    const data = await axios.get(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('broadcastingschedule')/items`,
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

export default getBroadcastingSchedule;
