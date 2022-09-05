import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

const PricingTable = ({ prices }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Renting Duration</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {prices
            ? Object.keys(prices).map((key) => (
                <TableRow key={key}>
                  <TableCell sx={{ width: "50%" }}>
                    {key == 1 ? key + " month " : key + " months "}
                  </TableCell>
                  <TableCell>
                    {key == 1 ? prices[key] + " €" : prices[key] + " € / month"}
                  </TableCell>
                </TableRow>
              ))
            : ""}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default PricingTable;
