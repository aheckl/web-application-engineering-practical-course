import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { AppContext } from "../../Context/AppContext";
import { useContext } from "react";
import { Typography } from "@mui/material";

const ConfiguratorSummaryTable = ({ psu, setPsu }) => {
  const { configuration, configurationDuration } = useContext(AppContext);

  const totalPrice = (
    Object.keys(configuration).reduce(
      (sum, item) =>
        (configuration[item] ? configuration[item].prices?.[configurationDuration] : 0) + sum,
      0
    ) + psu?.prices?.[configurationDuration]
  ).toFixed(2);

  return (
    <Box flex={6} sx={{ width: "66" }}>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead></TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Total price</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body1">{totalPrice + " € / month"}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">- 5% discount on fully configured PC</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body1">
                  {(totalPrice * 0.05).toFixed(2) + " € / month"}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Rent price</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body1">
                  {(totalPrice * 0.95).toFixed(2) + " € / month"}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Deposit (1 x monthly rent)</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body1">{(totalPrice * 0.95).toFixed(2) + " €"}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Total first monthly payment</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body1">{(totalPrice * 0.95 * 2).toFixed(2) + " €"}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ConfiguratorSummaryTable;
