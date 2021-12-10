import React, { useState, useEffect } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Button,
  Link,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { PrintIcon, Input, Select } from ".";
import { getActionsForDate } from "../api";
import dayjs from "dayjs";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PrintModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventChoices, setEventChoices] = useState([]);
  const [printableEvents, setPrintableEvents] = useState([]);
  const [formData, setFormData] = useState({
    date: dayjs().format("YYYY-MM-DD"),
    startEvent: "",
    endEvent: "",
  });

  const [docDefinition, setDocDefinition] = useState({
    header: function (currentPage, pageCount) {
      return {
        table: {
          widths: ["100%"],
          body: [
            [
              {
                text: `PAGE ${currentPage} OF ${pageCount}`,
                fontSize: 8,
                alignment: "right",
                margin: [0, 25, 45, 0],
              },
            ],
          ],
        },
        layout: "noBorders",
      };
    },
    footer: {
      table: {
        widths: ["50%", "50%"],
        body: [
          [
            {
              text: "DD Form 1753, SEP 70",
              fontSize: 8,
              bold: true,
              alignment: "left",
              margin: [45, 0, 0, 0],
            },
            {
              text: "HFGCS LOCAL VERSION FOR MASTER STATION LOG, DEC 16",
              alignment: "right",
              bold: true,
              fontSize: 8,
              margin: [0, 0, 45, 0],
            },
          ],
        ],
      },
      layout: "noBorders",
    },
    content: [
      {
        table: {
          widths: ["40%", "15%", "15%", "15%", "15%"],
          headerRows: 3,
          // keepWithHeaderRows: 1,
          body: [
            [
              {
                text: "MASTER STATION LOG",
                margin: [0, 12, 0, 0],
                rowSpan: 3,
                alignment: "center",
                fontSize: 8,
                bold: true,
              },
              {
                text: "FACILITY",
                borderColor: ["#000000", "#000000", "#000000", "#ffffff"],
                fontSize: 8,
                bold: true,
              },
              {
                text: "DATE",
                borderColor: ["#000000", "#000000", "#000000", "#ffffff"],
                fontSize: 8,
                bold: true,
              },
              {
                colSpan: 2,
                text: "TIME PERIOD",
                alignment: "center",
                fontSize: 8,
                bold: true,
              },
              {},
            ],
            [
              {},
              {
                text: "ANCS",
                alignment: "center",
                fontSize: 8,
                borderColor: ["#000000", "#ffffff", "#000000", "#ffffff"],
              },
              {
                text: `${dayjs(formData.date).format("DD MMM YYYY")}`,
                alignment: "center",
                fontSize: 8,
                borderColor: ["#000000", "#ffffff", "#000000", "#ffffff"],
              },
              {
                text: "FROM",
                borderColor: ["#000000", "#000000", "#000000", "#ffffff"],
                bold: true,
                fontSize: 8,
              },
              {
                text: "TO",
                borderColor: ["#000000", "#000000", "#000000", "#ffffff"],
                bold: true,
                fontSize: 8,
              },
            ],
            [
              {},
              { text: "ALPHA 1", alignment: "center", fontSize: 8 },
              {},
              { text: "0011", alignment: "center", fontSize: 8 },
              { text: "0011", alignment: "center", fontSize: 8 },
            ],
          ],
        },
      },
      {
        table: {
          widths: ["20%", "10%", "10%", "60%"],
          headerRows: 1,
          // keepWithHeaderRows: 1,
          body: [
            [
              {
                text: "CHANNEL OR CIRCUIT",
                alignment: "center",
                fontSize: 8,
                bold: true,
              },
              {
                text: "ZULU TIME",
                fontSize: 8,
                alignment: "center",
                bold: true,
              },
              {
                text: "OP INIT",
                fontSize: 8,
                alignment: "center",
                bold: true,
              },
              {
                text: "ACTION/EVENT",
                alignment: "center",
                fontSize: 8,
                bold: true,
              },
            ],
            // INSERT NEW ROWS HERE
          ],
        },
      },
    ],
    styles: {
      header: {},
    },
  });

  const handleEditField = (e) => {
    if (e.target.name === "date") {
      setDocDefinition((prevDoc) => {
        const newDoc = { ...prevDoc };
        newDoc.content[0].table.body[1][2].text = dayjs(e.target.value).format(
          "DD MMM YYYY"
        );

        return newDoc;
      });
    }

    if (e.target.name === "startEvent") {
      const startEventIndex = eventChoices.findIndex(
        (event) => event.id === e.target.value
      );
      // const newEvents = eventChoices.
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createPDF = () => {
    pdfMake.createPdf(docDefinition).open();
  };

  const fetchEvents = async () => {
    const response = await getActionsForDate(
      dayjs(formData.date).format("MM/DD/YYYY")
    );

    setEventChoices(response);
  };

  useEffect(() => {
    fetchEvents();
    setFormData({
      ...formData,
      startEvent: "",
      endEvent: "",
    });
  }, [formData.date]);

  useEffect(() => {
    console.log(docDefinition);
  }, [docDefinition]);

  return (
    <>
      <Link onClick={onOpen}>
        <PrintIcon />
      </Link>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white">
          <ModalHeader>Print</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={2} isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                onChange={handleEditField}
                name="date"
                value={formData.date}
                type="date"
              />
            </FormControl>
            <FormControl mb={2} isRequired>
              <FormLabel>Start Event</FormLabel>
              <Select
                onChange={handleEditField}
                value={formData.startEvent}
                name="startEvent"
                placeholder="Select start event"
              >
                {eventChoices.length &&
                  eventChoices.map((event) => (
                    <option key={event.Id + "start"} value={event.Id}>
                      {event.eventcategory}
                    </option>
                  ))}
              </Select>
            </FormControl>
            <FormControl mb={2} isRequired>
              <FormLabel>End Event</FormLabel>
              <Select
                onChange={handleEditField}
                value={formData.endEvent}
                name="endEvent"
                placeholder="Select end event"
              >
                {eventChoices.length &&
                  eventChoices.map((event) => (
                    <option key={event.Id + "end"} value={event.Id}>
                      {event.eventcategory}
                    </option>
                  ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={2} onClick={createPDF}>
              Confirm
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PrintModal;
