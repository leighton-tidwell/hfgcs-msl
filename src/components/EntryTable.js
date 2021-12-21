import React, { useEffect, useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { EditEntryModal, EditIcon } from ".";

const EntryTable = ({ entries, updateEntry, removeEntry, loading, ref }) => {
  const tableRef = useRef(null);
  const scrollToBottom = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [entries]);

  return (
    <Box
      bg="#010711"
      color="white"
      maxHeight="100%"
      overflowY="auto"
      rounded="sm"
    >
      <Table variant="msltable" rounded="sm">
        <Thead position="sticky" top="0">
          <Tr>
            <Th position="sticky">
              <EditIcon />
            </Th>
            <Th position="sticky">Event Category</Th>
            <Th position="sticky">Zulu Time</Th>
            <Th position="sticky">OP INITS</Th>
            <Th position="sticky">ACTION/EVENT</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading && (
            <Tr>
              <Td colSpan="5" textAlign="center">
                <Spinner />
              </Td>
            </Tr>
          )}
          {!entries.length && !loading && (
            <Tr>
              <Td colSpan="5" textAlign="center">
                <Text fontWeight="bolder">No entries found</Text>
              </Td>
            </Tr>
          )}
          {entries.map((entry) => (
            <Tr key={entry.Id}>
              <Td>
                <EditEntryModal
                  removeEntry={removeEntry}
                  updateEntry={updateEntry}
                  entryID={entry.Id}
                />
              </Td>
              <Td>{entry.category}</Td>
              <Td>{entry.time}</Td>
              <Td>{entry.operatorInitials}</Td>
              <Td>{entry.action}</Td>
            </Tr>
          ))}
          <div ref={tableRef} />
        </Tbody>
      </Table>
    </Box>
  );
};

export default EntryTable;
