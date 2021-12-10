import axios from "axios";
import { getFormDigest } from ".";

const dev = process.env.NODE_ENV === "development";

const removeFromList = async (listName, id) => {
  try {
    if (dev) return true;

    const data = await axios.post(
      `${process.env.REACT_APP_API}/web/lists/getbytitle('${listName}')/items('${id}')`,
      {},
      {
        headers: {
          Accept: "application/json; odata=verbose",
          "Content-Type": "application/json; odata=verbose",
          "IF-MATCH": "*",
          "X-HTTP-Method": "DELETE",
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

export default removeFromList;
