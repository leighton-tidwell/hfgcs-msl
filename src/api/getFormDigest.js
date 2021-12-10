import axios from "axios";

const dev = process.env.NODE_ENV === "development";

const getFormDigest = async () => {
  try {
    if (dev) return "";

    const data = await axios.post(
      `${process.env.REACT_APP_API}/contextinfo`,
      {},
      {
        headers: {
          Accept: "application/json; odata=verbose",
          "Content-Type": "application/json; odata=verbose",
        },
        withCredentials: true,
      }
    );

    const formDigest = data.data.d.GetContextWebInformation.FormDigestValue;
    return formDigest;
  } catch (error) {
    console.log(error);
  }
};

export default getFormDigest;
