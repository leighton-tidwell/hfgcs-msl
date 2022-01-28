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
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { PrintIcon, Input, Select } from ".";
import { getActionsForDate } from "../api";
import dayjs from "dayjs";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PrintModal = ({ selectedDate }) => {
  console.log(selectedDate);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [eventChoices, setEventChoices] = useState([]);
  const [printableEvents, setPrintableEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: dayjs(selectedDate, "MM/DD/YYYY").format("YYYY-MM-DD"),
    startEvent: "",
    endEvent: "",
  });

  const [docDefinition, setDocDefinition] = useState({
    header: function (currentPage, pageCount) {
      return {
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              {
                text: "SECRET",
                fontSize: 8,
                bold: true,
                alignment: "right",
                margin: [45, 25, 0, 0],
              },
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
          [
            {
              text: "SECRET",
              fontSize: 8,
              bold: true,
              alignment: "right",
              margin: [45, 0, 0, 0],
            },
            {},
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
          body: [],
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

    if (!eventChoices) return;

    if (e.target.name === "startEvent") {
      if (e.target.value !== "")
        setDocDefinition((prevDoc) => {
          const newDoc = { ...prevDoc };
          newDoc.content[0].table.body[2][3].text =
            eventChoices?.find((item) => item.Id == e.target.value)?.entrytime +
            "Z";
          return newDoc;
        });
    }

    if (e.target.name === "endEvent") {
      if (e.target.value !== "")
        setDocDefinition((prevDoc) => {
          const newDoc = { ...prevDoc };
          newDoc.content[0].table.body[2][4].text =
            eventChoices?.find((item) => item.Id == e.target.value)?.entrytime +
            "Z";
          return newDoc;
        });
    }

    if (e.target.name === "startEvent" || e.target.name === "endEvent") {
      const isStartEvent = e.target.name === "startEvent";

      const startEventIndex = isStartEvent
        ? eventChoices.findIndex((event) => event.Id == e.target.value)
        : formData.startEvent
        ? eventChoices.findIndex((event) => event.Id == formData.startEvent)
        : 0;

      const endEventIndex = !isStartEvent
        ? eventChoices.findIndex((event) => event.Id == e.target.value)
        : formData.endEvent
        ? eventChoices.findIndex((event) => event.Id == formData.endEvent)
        : eventChoices.length;

      const items =
        startEventIndex < endEventIndex
          ? eventChoices.slice(startEventIndex, endEventIndex + 1)
          : eventChoices.slice(endEventIndex, startEventIndex + 1).reverse();

      setDocDefinition((prevDoc) => {
        const newDoc = { ...prevDoc };
        newDoc.content[1].table.body = items.map((item, i) => [
          {
            text: item.eventcategory,
            borderColor: [
              "#000000",
              "#000000",
              "#000000",
              i === items.length - 1 ? "#000000" : "#ffffff",
            ],
            fontSize: 8,
          },
          {
            text: item.entrytime,
            borderColor: [
              "#000000",
              "#000000",
              "#000000",
              i === items.length - 1 ? "#000000" : "#ffffff",
            ],
            fontSize: 8,
          },
          {
            text: item.operatorinitials,
            borderColor: [
              "#000000",
              "#000000",
              "#000000",
              i === items.length - 1 ? "#000000" : "#ffffff",
            ],
            fontSize: 8,
          },
          {
            text: item.action,
            borderColor: [
              "#000000",
              "#000000",
              "#000000",
              i === items.length - 1 ? "#000000" : "#ffffff",
            ],
            fontSize: 8,
          },
        ]);

        newDoc.content[1].table.body.unshift([
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
        ]);

        return newDoc;
      });
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createPDF = () => {
    pdfMake.createPdf(docDefinition).open();
  };

  const fetchEvents = async () => {
    try {
      const response = await getActionsForDate(
        dayjs(formData.date).format("MM/DD/YYYY")
      );

      const sortedResponses = response.sort((a, b) => {
        if (a.entrytime === b.entrytime) return a.Id > b.Id ? 1 : -1;
        return a.entrytime > b.entrytime ? 1 : -1;
      });

      setEventChoices(sortedResponses);
    } catch (error) {
      toast({
        title: `An error occured: ${error.message}`,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
    setLoading(false);
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      date: dayjs(selectedDate, "MM/DD/YYYY").format("YYYY-MM-DD"),
    }));
  }, [selectedDate]);

  return (
    <>
      <Link onClick={onOpen}>
        <PrintIcon />
      </Link>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white">
          <ModalHeader>Print {loading && <Spinner size="sm" />}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={2} isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                isDisabled={loading}
                onChange={handleEditField}
                name="date"
                value={formData.date}
                type="date"
              />
            </FormControl>
            <FormControl mb={2} isRequired>
              <FormLabel>Start Event</FormLabel>
              <Select
                isDisabled={loading}
                onChange={handleEditField}
                value={formData.startEvent}
                name="startEvent"
                placeholder="Select start event"
              >
                {eventChoices.length &&
                  eventChoices.map((event) => (
                    <option key={event.Id + "start"} value={event.Id}>
                      {event.eventcategory} - {event.entrytime}Z
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
                      {event.eventcategory} - {event.entrytime}Z
                    </option>
                  ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              isDisabled={loading}
              mr={2}
              onClick={createPDF}
            >
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
