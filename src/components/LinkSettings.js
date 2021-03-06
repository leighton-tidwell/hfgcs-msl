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
  Spinner,
  useToast,
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
  const toast = useToast();

  const fetchLinks = async () => {
    try {
      const response = await getLinks();
      const formReadyLinks = response.map((item) => ({
        ...item,
        isEditable: false,
      }));

      setLinks(formReadyLinks);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleEditField = (Id, field, value) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.Id === Id ? { ...link, [field]: value } : link
      )
    );
  };

  const toggleLinkItemEditable = async (Id) => {
    try {
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
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDeleteLink = async (Id) => {
    try {
      setLinks((prevLinks) => prevLinks.filter((item) => item.Id !== Id));
      const response = await removeFromList("links", Id);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleAddLink = async (link) => {
    try {
      const response = await insertIntoList("links", link);
      const newLink = {
        ...link,
        isEditable: false,
        Id: response,
      };
      setLinks((prevLinks) => [...prevLinks, newLink]);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
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
      <Box
        maxHeight="500px"
        overflowY="auto"
        overflowX="hidden"
        css={{
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#2d3748",
            borderRadius: "10px",
            border: "2px solid #1a202c",
          },
        }}
      >
        <Table variant="msltable" rounded="sm">
          <Thead position="sticky" top="0">
            <Tr>
              <Th position="sticky">EDIT</Th>
              <Th position="sticky">Name</Th>
              <Th position="sticky">Link</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!links.length && (
              <Tr>
                <Td textAlign="center" colSpan="3">
                  <Spinner />
                </Td>
              </Tr>
            )}
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
                    <Link href={link.link}>{link.link}</Link>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default LinkSettings;
