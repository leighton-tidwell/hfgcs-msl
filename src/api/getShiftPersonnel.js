import axios from "axios";

const sampleData = [
  {
    Id: "1dfddd",
    shiftname: "OFFICE HOURS",
    rank: "SSGT",
    lastname: "BARNES",
    initials: "JT",
    isShiftLead: "true",
    status: "ON DUTY",
  },
  {
    Id: "2dfddd",
    shiftname: "OFFICE HOURS",
    rank: "SSGT",
    lastname: "NOBLE",
    initials: "TJ",
    isShiftLead: "false",
    status: "ON DUTY",
  },
  {
    Id: "3dfddd",
    shiftname: "OFFICE HOURS",
    rank: "SSGT",
    lastname: "HARVEY",
    initials: "LJ",
    isShiftLead: "false",
    status: "ON DUTY",
  },
  {
    Id: "4dfddd",
    shiftname: "BRAVO 1",
    rank: "SSGT",
    lastname: "BARNES",
    initials: "MJ",
    isShiftLead: "true",
    status: "SHIFT LEAD",
  },
  {
    Id: "5dfddd",
    shiftname: "BRAVO 1",
    rank: "SSGT",
    lastname: "NOBLE",
    initials: "BH",
    isShiftLead: "false",
    status: "ON DUTY",
  },
  {
    Id: "6dfddd",
    shiftname: "BRAVO 1",
    rank: "SSGT",
    lastname: "HARVEY",
    initials: "GD",
    isShiftLead: "false",
    status: "ON DUTY",
  },
  {
    Id: "7dfddd",
    shiftname: "BRAVO 2",
    rank: "SSGT",
    lastname: "BARNES",
    initials: "FD",
    isShiftLead: "true",
    status: "ON DUTY",
  },
  {
    Id: "8dfddd",
    shiftname: "BRAVO 2",
    rank: "SSGT",
    lastname: "NOBLE",
    initials: "SD",
    isShiftLead: "false",
    status: "ON DUTY",
  },
  {
    Id: "9dfddd",
    shiftname: "BRAVO 2",
    rank: "SSGT",
    lastname: "HARVEY",
    initials: "EW",
    isShiftLead: "false",
    status: "ON DUTY",
  },
  {
    Id: "10dfddd",
    shiftname: "ALPHA 1",
    rank: "SSGT",
    lastname: "BARNES",
    initials: "AV",
    isShiftLead: "true",
    status: "ON DUTY",
  },
  {
    Id: "11dfddd",
    shiftname: "ALPHA 1",
    rank: "SSGT",
    lastname: "NOBLE",
    initials: "BE",
    isShiftLead: "false",
    status: "ON DUTY",
  },
  {
    Id: "12dfddd",
    shiftname: "ALPHA 1",
    rank: "SSGT",
    lastname: "HARVEY",
    initials: "GE",
    isShiftLead: "false",
    status: "ON DUTY",
  },
  {
    Id: "13dfddd",
    shiftname: "ALPHA 2",
    rank: "SSGT",
    lastname: "BARNES",
    initials: "WW",
    isShiftLead: "true",
    status: "ON DUTY",
  },
  {
    Id: "14dfddd",
    shiftname: "ALPHA 2",
    rank: "SSGT",
    lastname: "NOBLE",
    initials: "QQ",
    isShiftLead: "false",
    status: "ON DUTY",
  },
  {
    Id: "15dfddd",
    shiftname: "ALPHA 2",
    rank: "SSGT",
    lastname: "HARVEY",
    initials: "HH",
    isShiftLead: "false",
    status: "ON DUTY",
  },
];

const dev = process.env.NODE_ENV === "development";

const getShiftPersonnel = async (shift) => {
  try {
    if (dev)
      return shift
        ? sampleData.filter((person) => person.shiftname === shift)
        : sampleData;

    const data = await axios.get(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('personnel')/items`,
      {
        headers: {
          Accept: "application/json; odata=verbose",
        },
        withCredentials: true,
      }
    );

    const results = data.data.d.results;
    if (!shift) return results;

    const filteredResults = results.filter(
      (person) => person.shiftname === shift
    );

    return filteredResults;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default getShiftPersonnel;
