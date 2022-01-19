import React, { useState, useEffect } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import ExcelJS from "exceljs/dist/es5/exceljs.browser.js";
import { saveAs } from "file-saver";
import { getStations } from "../api";
import { borderCells } from "./cellData";

const StationStatusSettings = () => {
  const [stations, setStations] = useState([]);

  const handleDownload = async () => {
    const wb = new ExcelJS.Workbook();

    const ws = wb.addWorksheet();

    ws.columns = [
      { key: "1", width: 10 },
      { key: "2", width: 10 },
      { key: "3", width: 10 },
      { key: "4", width: 10 },
      { key: "5", width: 10 },
      { key: "6", width: 10 },
      { key: "7", width: 10 },
      { key: "8", width: 10 },
      { key: "9", width: 10 },
      { key: "10", width: 10 },
      { key: "11", width: 10 },
      { key: "12", width: 15 },
      { key: "13", width: 10 },
    ];

    const headerRow = ws.addRow([
      "",
      "",
      "System Status",
      "",
      "",
      "SCANS",
      "DTMF",
      "",
      "ALE",
      "HF Data",
      "",
      "Broadcast",
      "",
    ]);

    headerRow.height = 20;

    ws.mergeCells("C1:E1");
    ws.mergeCells("G1:H1");
    ws.mergeCells("J1:K1");

    ["B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1"].map(
      (key) => {
        ws.getCell(key).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "757171" },
        };

        ws.getCell(key).font = {
          bold: true,
          size: 14,
          name: "Calibri",
          color: { argb: "FFFFFF" },
        };

        ws.getCell(key).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      }
    );

    const ancsRow = ws.addRow([
      "",
      "HFGCS SYSTEM",
      "ANCS",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    ancsRow.font = {
      bold: true,
      size: 14,
      name: "Calibri",
    };

    ["C2", "D2", "E2", "F2", "G2", "H2", "I2", "J2", "K2", "L2"].map((key) => {
      ws.getCell(key).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "008000" },
      };
    });

    ws.getCell("B2").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0000" },
    };
    ws.mergeCells("C2:E2");
    ws.mergeCells("G2:H2");
    ws.mergeCells("J2:K2");

    const gfncsRow = ws.addRow([
      "",
      "",
      "GFNCS",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    gfncsRow.font = {
      bold: true,
      size: 14,
      name: "Calibri",
    };

    ["C3", "D3", "E3", "F3", "G3", "H3", "I3", "J3", "K3", "L3"].map((key) => {
      ws.getCell(key).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "008000" },
      };
    });

    ws.mergeCells("C3:E3");
    ws.mergeCells("G3:H3");
    ws.mergeCells("J3:K3");

    const americanTheaterStatus = { amber: 0, red: 0 };
    const americanTheaterStations = stations.filter(
      (station) => station.theater === "American Theater"
    );
    americanTheaterStations.map((station, i) => {
      const row = ws.addRow([
        "",
        "",
        i === 0 ? "American\nTheater" : "",
        station.name,
        "",
        station.scansdesc,
        "",
        "",
        "",
        "",
        "",
        station.stratdesc,
      ]);

      row.alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      row.font = {
        bold: true,
        size: 14,
        name: "Calibri",
      };

      ws.getCell(`F${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            station.scanscolor === "red"
              ? "FF0000"
              : station.scanscolor === "amber"
              ? "FFFF00"
              : "008000",
        },
      };

      ws.getCell(`F${row._number}`).font = {
        bold: false,
        size: 10,
        name: "Calibri",
      };

      ws.getCell(`G${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            station.dtmfcolor === "red"
              ? "FF0000"
              : station.dtmfcolor === "amber"
              ? "FFFF00"
              : "008000",
        },
      };

      ws.getCell(`I${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            station.alecolor === "red"
              ? "FF0000"
              : station.alecolor === "amber"
              ? "FFFF00"
              : "008000",
        },
      };

      ws.getCell(`J${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "008000",
        },
      };

      ws.getCell(`L${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            station.stratcolor === "red"
              ? "FF0000"
              : station.stratcolor === "amber"
              ? "FFFF00"
              : "008000",
        },
      };

      ws.getCell(`L${row._number}`).font = {
        bold: false,
        size: 10,
        name: "Calibri",
      };

      if (station.scanscolor === "red") {
        ws.getCell(`D${row._number}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FF0000",
          },
        };
        americanTheaterStatus.red++;
      } else if (
        station.scanscolor === "amber" ||
        station.stratcolor === "red"
      ) {
        ws.getCell(`D${row._number}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFFF00",
          },
        };
        americanTheaterStatus.amber++;
      } else {
        ws.getCell(`D${row._number}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "008000",
          },
        };
      }

      ws.mergeCells(`D${row._number}:E${row._number}`);
      ws.mergeCells(`G${row._number}:H${row._number}`);
      ws.mergeCells(`J${row._number}:K${row._number}`);
    });

    const pacificTheaterStatus = { amber: 0, red: 0 };
    const pacificTheaterStations = stations.filter(
      (station) => station.theater === "Pacific Theater"
    );
    pacificTheaterStations.map((station, i) => {
      const row = ws.addRow([
        "",
        "",
        i === 0 ? "Pacific\nTheater" : "",
        station.name,
        "",
        station.scansdesc,
        "",
        "",
        "",
        "",
        "",
        station.stratdesc,
      ]);

      row.alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      row.font = {
        bold: true,
        size: 14,
        name: "Calibri",
      };

      ws.getCell(`F${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            station.scanscolor === "red"
              ? "FF0000"
              : station.scanscolor === "amber"
              ? "FFFF00"
              : "008000",
        },
      };

      ws.getCell(`F${row._number}`).font = {
        bold: false,
        size: 10,
        name: "Calibri",
      };

      ws.getCell(`G${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            station.dtmfcolor === "red"
              ? "FF0000"
              : station.dtmfcolor === "amber"
              ? "FFFF00"
              : "008000",
        },
      };

      ws.getCell(`I${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            station.alecolor === "red"
              ? "FF0000"
              : station.alecolor === "amber"
              ? "FFFF00"
              : "008000",
        },
      };

      ws.getCell(`J${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "008000",
        },
      };

      ws.getCell(`L${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            station.stratcolor === "red"
              ? "FF0000"
              : station.stratcolor === "amber"
              ? "FFFF00"
              : "008000",
        },
      };

      ws.getCell(`L${row._number}`).font = {
        bold: false,
        size: 10,
        name: "Calibri",
      };

      if (station.scanscolor === "red") {
        ws.getCell(`D${row._number}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FF0000",
          },
        };
        pacificTheaterStatus.red++;
      } else if (
        station.scanscolor === "amber" ||
        station.stratcolor === "red"
      ) {
        ws.getCell(`D${row._number}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFFF00",
          },
        };
        pacificTheaterStatus.amber++;
      } else {
        ws.getCell(`D${row._number}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "008000",
          },
        };
      }

      ws.mergeCells(`D${row._number}:E${row._number}`);
      ws.mergeCells(`G${row._number}:H${row._number}`);
      ws.mergeCells(`J${row._number}:K${row._number}`);
    });

    const europeanTheaterStatus = { amber: 0, red: 0 };
    const europeanTheaterStations = stations.filter(
      (station) => station.theater === "European Theater"
    );
    europeanTheaterStations.map((station, i) => {
      const row = ws.addRow([
        "",
        "",
        i === 0 ? "European\nTheater" : "",
        station.name,
        "",
        station.scansdesc,
        "",
        "",
        "",
        "",
        "",
        station.stratdesc,
      ]);

      row.alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      row.font = {
        bold: true,
        size: 14,
        name: "Calibri",
        // color: { argb: "FFFFFF" },
      };

      ws.getCell(`F${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            station.scanscolor === "red"
              ? "FF0000"
              : station.scanscolor === "amber"
              ? "FFFF00"
              : "008000",
        },
      };

      ws.getCell(`F${row._number}`).font = {
        bold: false,
        size: 10,
        name: "Calibri",
      };

      ws.getCell(`G${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            station.dtmfcolor === "red"
              ? "FF0000"
              : station.dtmfcolor === "amber"
              ? "FFFF00"
              : "008000",
        },
      };

      ws.getCell(`I${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            station.alecolor === "red"
              ? "FF0000"
              : station.alecolor === "amber"
              ? "FFFF00"
              : "008000",
        },
      };

      ws.getCell(`J${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "008000",
        },
      };

      ws.getCell(`L${row._number}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            station.stratcolor === "red"
              ? "FF0000"
              : station.stratcolor === "amber"
              ? "FFFF00"
              : "008000",
        },
      };

      ws.getCell(`L${row._number}`).font = {
        bold: false,
        size: 10,
        name: "Calibri",
      };

      if (station.scanscolor === "red") {
        ws.getCell(`D${row._number}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FF0000",
          },
        };
        europeanTheaterStatus.red++;
      } else if (
        station.scanscolor === "amber" ||
        station.stratcolor === "red"
      ) {
        ws.getCell(`D${row._number}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFFF00",
          },
        };
        europeanTheaterStatus.amber++;
      } else {
        ws.getCell(`D${row._number}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "008000",
          },
        };
      }

      ws.mergeCells(`D${row._number}:E${row._number}`);
      ws.mergeCells(`G${row._number}:H${row._number}`);
      ws.mergeCells(`J${row._number}:K${row._number}`);
    });

    const hfgcsStatus = { amber: 0, red: 0 };

    // Determine the status of the theater
    if (americanTheaterStatus.red >= 2 || americanTheaterStatus.amber >= 4) {
      ws.getCell("C4").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF0000",
        },
      };
      hfgcsStatus.red++;
    } else if (
      americanTheaterStatus.red === 1 ||
      americanTheaterStatus.amber === 3
    ) {
      ws.getCell("C4").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FFFF00",
        },
      };
      hfgcsStatus.amber++;
    } else {
      ws.getCell("C4").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "008000",
        },
      };
    }

    if (pacificTheaterStatus.red >= 2 || pacificTheaterStatus.amber >= 4) {
      ws.getCell("C8").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF0000",
        },
      };
      hfgcsStatus.red++;
    } else if (
      pacificTheaterStatus.red === 1 ||
      pacificTheaterStatus.amber === 3
    ) {
      ws.getCell("C8").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FFFF00",
        },
      };
      hfgcsStatus.amber++;
    } else {
      ws.getCell("C8").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "008000",
        },
      };
    }

    if (europeanTheaterStatus.red >= 2 || europeanTheaterStatus.amber >= 4) {
      ws.getCell("C13").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF0000",
        },
      };
      hfgcsStatus.red++;
    } else if (
      europeanTheaterStatus.red === 1 ||
      europeanTheaterStatus.amber === 3
    ) {
      ws.getCell("C13").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FFFF00",
        },
      };
      hfgcsStatus.amber++;
    } else {
      ws.getCell("C13").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "008000",
        },
      };
    }

    // Style HGFCS System Cells
    ws.getCell("B2").style = {
      alignment: {
        textRotation: 90,
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      },
      font: {
        size: 14,
        bold: true,
      },
    };

    console.log(hfgcsStatus);

    if (hfgcsStatus.amber === 2) {
      ws.getCell("B2").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FFFF00",
        },
      };
    } else if (hfgcsStatus.amber === 3) {
      ws.getCell("B2").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF0000",
        },
      };
    } else if (hfgcsStatus.red >= 1) {
      ws.getCell("B2").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF0000",
        },
      };
    } else {
      ws.getCell("B2").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "008000",
        },
      };
    }

    // Add borders to all cells
    borderCells.map((key) => {
      ws.getCell(key).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    ws.mergeCells("B2:B16"); // merge HFCS SYSTEM cells
    ws.mergeCells("C4:C7"); // merge american theater cells
    ws.getCell("C4").alignment = {
      textRotation: 90,
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    ws.getCell("C4").font = {
      size: 14,
      bold: true,
    };

    ws.mergeCells("C8:C12"); // merge pacific theater cells
    ws.getCell("C8").alignment = {
      textRotation: 90,
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    ws.getCell("C8").font = {
      size: 14,
      bold: true,
    };

    ws.mergeCells("C13:C16"); // merge european theater cells
    ws.getCell("C13").alignment = {
      textRotation: 90,
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    ws.getCell("C13").font = {
      size: 14,
      bold: true,
    };

    const buf = await wb.xlsx.writeBuffer();

    saveAs(new Blob([buf]), "HFGCSStationStatus.xlsx");
  };

  const fetchStations = async () => {
    const data = await getStations();
    setStations(data);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <Box display="flex">
      <Box flexGrow="1" mr={2} display="flex" flexDir="column">
        <Box mb={3} display="flex" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" flexGrow="1">
            Download Station Status:
          </Text>
        </Box>
        <Button
          onClick={handleDownload}
          colorScheme="blue"
          width="300px"
          mr={2}
        >
          Download Station Status
        </Button>
      </Box>
    </Box>
  );
};

export default StationStatusSettings;
