import axios from "axios";

const sampleResults = [
  {
    Id: "1ee2333e",
    name: "ASI Docs",
    link: "https://docs.microsoft.com/en-us/azure/app-service-internet-availability-api",
  },
  {
    Id: "2ee2333e",
    name: "ASI Docs",
    link: "https://docs.microsoft.com/en-us/azure/app-service-internet-availability-api",
  },
  {
    Id: "3ee2333e",
    name: "ASI Docs",
    link: "https://docs.microsoft.com/en-us/azure/app-service-internet-availability-api",
  },
];

const dev = process.env.NODE_ENV === "development";

const getLinks = async () => {
  try {
    if (dev) return sampleResults;

    const data = await axios.get(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('links')/items`,
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

export default getLinks;
