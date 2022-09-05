import React from "react";
import { Typography, Stack } from "@mui/material";

function SummaryLine({ lineTitle, lineValue }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
      <Typography>{lineTitle}</Typography>
      <Typography>{lineValue}</Typography>
    </Stack>
  );
}

export default SummaryLine;
