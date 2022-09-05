import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import React from "react";

const descriptionMapping = {
  name: "Name",
  type: "Category",
  manufacturer: "Manufacturer",
  coreCount: "Cores",
  cpuSocket: "Socket",
  coreSpeed: "Clock Speed",
  series: "Product Series",
  caseType: "Type",
  caseColor: "Color",
  mainboardChipset: "Chipset",
  driveCapacity: "Capacity",
  driveType: "Type",
  writeSpeed: "Write Speed",
  readSpeed: "Read Speed",
  vram: "VRAM",
  gpuSpeed: "Clock Speed",
  memorySpeed: "Speed",
  ram: "RAM",
  ramType: "Type",
  watts: "Watts",
  subtype: "Category",
};

const typeMapping = {
  gpu: "Graphics Card",
  cpu: "Processor",
  case: "Case",
  ram: "Memory",
  drive: "Storage",
  mainboard: "Mainboard",
  psu: "Power Supply Unit",
};

const unitMapping = {
  name: "",
  type: "",
  manufacturer: "",
  coreCount: "",
  cpuSocket: "",
  coreSpeed: "GHz",
  series: "",
  caseType: "",
  caseColor: "",
  mainboardChipset: "",
  driveCapacity: "GB",
  driveType: "",
  writeSpeed: "MB/s",
  readSpeed: "MB/s",
  vram: "GB",
  gpuSpeed: "GHz",
  memorySpeed: "MHz",
  ram: "GB",
  ramType: "",
  watts: "",
};

function getRelevantKeys(product) {
  let properTypeAttr = product?.type == "secondHand" ? "subtype" : "type";
  let properType = product?.type == "secondHand" ? product?.subtype : product?.type; //e.g. "cpu"

  let relevantKeys = ["name", properTypeAttr, "manufacturer"];

  switch (properType) {
    case "cpu":
      relevantKeys.push("coreCount", "cpuSocket", "coreSpeed", "series");
      break;
    case "gpu":
      relevantKeys.push("series", "vram", "gpuSpeed");
      break;
    case "ram":
      relevantKeys.push("memorySpeed", "ram", "ramType");
      break;
    case "mainboard":
      relevantKeys.push("cpuSocket", "mainboardChipset");
      break;
    case "case":
      relevantKeys.push("caseType", "caseColor");
      break;
    case "drive":
      relevantKeys.push("driveCapacity", "driveType", "writeSpeed", "readSpeed");
      break;
    case "psu":
      relevantKeys.push("watts");
      break;
  }
  // cases are the only category that does not have a watts attribute in the DB
  if (properType != "case") {
    relevantKeys.push("watts");
  }

  return relevantKeys;
}

const TechnicalDataTable = ({ product }) => {
  const relevantKeys = getRelevantKeys(product);

  const relevantValues = relevantKeys.map((key) =>
    key == "type" || key == "subtype"
      ? typeMapping[product?.[key]]
      : product?.[key] + " " + unitMapping[key]
  );

  const relevantDesignations = relevantKeys.map((key) => descriptionMapping[key]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {relevantDesignations.map((designation, index) => (
            <TableRow key={index}>
              <TableCell sx={{ width: "50%" }}>{designation}</TableCell>
              <TableCell>{relevantValues[index]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default TechnicalDataTable;
