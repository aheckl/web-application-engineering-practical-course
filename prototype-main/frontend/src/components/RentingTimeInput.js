import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

const RentingTimeInput = ({ rentingTime, handleChange }) => {
  return (
    <FormControl>
      <InputLabel id="configurator-select-label">Renting Time</InputLabel>
      <Select
        labelId="configurator-select-label"
        id="configurator-select"
        value={rentingTime}
        label="Renting Time"
        onChange={handleChange}
        sx={{ backgroundColor: "white" }}
      >
        <MenuItem value={1}>1 Month</MenuItem>
        <MenuItem value={2}>2 Months</MenuItem>
        <MenuItem value={3}>3 Months</MenuItem>
        <MenuItem value={6}>6 Months</MenuItem>
        <MenuItem value={12}>12 Months</MenuItem>
        <MenuItem value={18}>18 Months</MenuItem>
      </Select>
    </FormControl>
  );
};

export default RentingTimeInput;
