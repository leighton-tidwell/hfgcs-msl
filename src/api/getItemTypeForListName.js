const getItemTypeForListName = (name) => {
  let addedChar = "";
  if (name === "eventlog") addedChar = "1";
  return `SP.Data.${
    name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1)
  }${addedChar}ListItem`;
};

export default getItemTypeForListName;
