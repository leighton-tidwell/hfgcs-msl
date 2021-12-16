import axios from "axios";

const sampleData = [
  {
    Id: "1df333dd",
    status: "ALS",
  },
  {
    Id: "2df333dd",
    status: "ALT DUTY",
  },
  {
    Id: "3df333dd",
    status: "APPOINTMENT",
  },
  {
    Id: "4df333dd",
    status: "ON DUTY",
  },
  {
    Id: "5df333dd",
    status: "SHIFT LEAD",
  },
];

const dev = process.env.NODE_ENV === "development";

const getPersonnelStatus = async () => {
  try {
    if (dev) return sampleData;

    const data = await axios.get(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('personnelstatus')/items`,
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

export default getPersonnelStatus;
