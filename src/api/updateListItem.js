import axios from "axios";
import { getFormDigest, getItemTypeForListName } from ".";

const dev = process.env.NODE_ENV === "development";

const updateListItem = async (listName, itemProperties) => {
  try {
    if (dev) return true;

    itemProperties.__metadata = {
      type: getItemTypeForListName(listName),
    };

    const data = await axios.post(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('${listName}')/items('${itemProperties.Id}')`,
      itemProperties,
      {
        headers: {
          Accept: "application/json; odata=verbose",
          "Content-Type": "application/json; odata=verbose",
          "IF-MATCH": "*",
          "X-HTTP-Method": "MERGE",
          "X-RequestDigest": await getFormDigest(),
        },
        withCredentials: true,
      }
    );

    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default updateListItem;
