import axios from "axios";
import { getFormDigest, getItemTypeForListName } from ".";
import { v4 as uuidv4 } from "uuid";

const dev = process.env.NODE_ENV === "development";

const insertIntoList = async (listName, itemProperties) => {
  try {
    if (dev) return uuidv4();

    itemProperties.__metadata = {
      type: getItemTypeForListName(listName),
    };

    const data = await axios.post(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('${listName}')/items`,
      itemProperties,
      {
        headers: {
          Accept: "application/json; odata=verbose",
          "Content-Type": "application/json; odata=verbose",
          "odata-version": "",
          "X-RequestDigest": await getFormDigest(),
        },
        withCredentials: true,
      }
    );

    const {
      data: {
        d: { Id },
      },
    } = data;

    return Id;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default insertIntoList;
