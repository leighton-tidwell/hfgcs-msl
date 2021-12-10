import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
} from "@chakra-ui/react";
import {
  getLinks,
  updateListItem,
  removeFromList,
  insertIntoList,
} from "../api";
import { EditIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { ConfirmModal, Input, AddSettingsModal } from ".";

const LinkSettings = () => {
  const [links, setLinks] = useState([]);

  const fetchLinks = async () => {
    const response = await getLinks();
    const formReadyLinks = response.map((item) => ({
      ...item,
      isEditable: false,
    }));

    setLinks(formReadyLinks);
  };

  const handleEditField = (Id, field, value) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.Id === Id ? { ...link, [field]: value } : link
      )
    );
  };

  const toggleLinkItemEditable = async (Id) => {
    const updatedLinkItem = links.find((item) => item.Id === Id);
    if (updatedLinkItem.isEditable) {
      const formattedLinkItem = {
        Id: updatedLinkItem.Id,
        name: updatedLinkItem.name,
        link: updatedLinkItem.link,
      };
      const response = await updateListItem("links", formattedLinkItem);
    }

    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.Id === Id ? { ...link, isEditable: !link.isEditable } : link
      )
    );
  };

  const handleDeleteLink = async (Id) => {
    const response = await removeFromList("links", Id);
    setLinks((prevLinks) => prevLinks.filter((item) => item.Id !== Id));
  };

  const handleAddLink = async (link) => {
    const response = await insertIntoList("links", link);
    const newLink = {
      ...link,
      isEditable: false,
      Id: response,
    };
    setLinks((prevLinks) => [...prevLinks, newLink]);
  };

  const addLinkParams = {
    name: "Link",
    fields: [
      {
        id: "linkNameInput",
        name: "Name",
        databaseName: "name",
        type: "text",
      },
      {
        id: "linkLinkInput",
        name: "Link",
        databaseName: "link",
        type: "text",
      },
    ],
    onSubmit: handleAddLink,
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <Box>
      <Box mb={3} display="flex" alignItems="center">
        <Text fontWeight="bold" fontSize="lg" flexGrow="1">
          Links:
        </Text>
        <Box mr={2}>
          <AddSettingsModal parameters={addLinkParams} />
        </Box>
      </Box>
      <Table variant="msltable" rounded="sm">
        <Thead>
          <Tr>
            <Th>EDIT</Th>
            <Th>Name</Th>
            <Th>Link</Th>
          </Tr>
        </Thead>
        <Tbody>
          {links.map((link) => (
            <Tr key={link.Id}>
              <Td minWidth="100px">
                <Link onClick={() => toggleLinkItemEditable(link.Id)}>
                  {link.isEditable ? <CheckIcon /> : <EditIcon />}
                </Link>
                <ConfirmModal
                  ml={2}
                  onConfirm={() => handleDeleteLink(link.Id)}
                  Icon={<DeleteIcon />}
                  message="Are you sure you want to delete this link?"
                />
              </Td>
              <Td>
                {link.isEditable ? (
                  <Input
                    type="text"
                    value={link.name}
                    onChange={(e) =>
                      handleEditField(link.Id, "name", e.target.value)
                    }
                  />
                ) : (
                  link.name
                )}
              </Td>
              <Td>
                {link.isEditable ? (
                  <Input
                    type="text"
                    value={link.link}
                    onChange={(e) =>
                      handleEditField(link.Id, "link", e.target.value)
                    }
                  />
                ) : (
                  link.link
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default LinkSettings;
