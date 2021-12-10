const getItemTypeForListName = (name) => {
  return `SP.Data.${
    name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1)
  }ListItem`;
};

export default getItemTypeForListName;
