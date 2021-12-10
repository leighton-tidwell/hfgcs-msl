import React from "react";
import { Table, Thead, Tbody, Text, Tr, Th, Td, Box } from "@chakra-ui/react";
import { EditEntryModal, EditIcon } from ".";

const EntryTable = ({ entries, updateEntry, removeEntry }) => {
  return (
    <Box bg="#010711" color="white" height="100%" rounded="sm">
      <Table variant="msltable" rounded="sm">
        <Thead>
          <Tr>
            <Th>
              <EditIcon />
            </Th>
            <Th>Event Category</Th>
            <Th>Zulu Time</Th>
            <Th>OP INITS</Th>
            <Th>ACTION/EVENT</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!entries.length && <Text>No entries found</Text>}
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
        </Tbody>
      </Table>
    </Box>
  );
};

export default EntryTable;
