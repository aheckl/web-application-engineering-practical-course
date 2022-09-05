import {
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from "@mui/material";
import Axios from "axios";
import React, { useEffect, useState } from "react";

function CpuFilter_ALT({ manufacturerFilter, productType, setSpecificQuery }) {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [coreCounts, setCoreCounts] = useState([]);
  const [coreCountFilter, setCoreCountFilter] = useState([]);
  const [cpuSockets, setCpuSockets] = useState([]);
  const [cpuSocketFilter, setCpuSocketFilter] = useState([]);
  const [coreSpeeds, setCoreSpeeds] = useState([]);
  const [coreSpeedFilter, setCoreSpeedFilter] = useState([]);

  useEffect(() => {
    updateAttributeOptions();
  }, []);

  useEffect(() => {
    setSpecificQuery({
      coreCount: coreCountFilter,
      cpuSocket: cpuSocketFilter,
      coreSpeed: coreSpeedFilter,
    });
  }, [cpuSocketFilter, coreCountFilter, coreSpeedFilter]);

  useEffect(() => {
    setCoreCountFilter([]);
    setCpuSocketFilter([]);
    setCoreSpeedFilter([]);
  }, [manufacturerFilter]);

  const handleFilterChange = (event, setter) => {
    const {
      target: { value },
    } = event;
    setter(typeof value === "string" ? value.split(",") : value);
  };

  const updateAttributeOptions = () => {
    const seriesQuery = { manufacturer: manufacturerFilter };
    fetchAttributeOptions("coreCount", setCoreCounts, seriesQuery);
    fetchAttributeOptions("cpuSocket", setCpuSockets, seriesQuery);
    fetchAttributeOptions("coreSpeed", setCoreSpeeds, seriesQuery);
  };

  const fetchAttributeOptions = (attribute, setter, query) => {
    Axios.get(`http://localhost:8080/part/${productType}/${attribute}`, {
      params: query,
    }).then((result) => {
      setter(result.data);
    });
  };

  const selectFilters = [
    {
      title: "CPU Socket",
      setFilter: setCpuSocketFilter,
      filter: cpuSocketFilter,
      choices: cpuSockets,
    },
    {
      title: "Core Count",
      setFilter: setCoreCountFilter,
      filter: coreCountFilter,
      choices: coreCounts,
    },
    {
      title: "Core Speed",
      setFilter: setCoreSpeedFilter,
      filter: coreSpeedFilter,
      choices: coreSpeeds,
      unit: "GHz",
    },
  ];

  return selectFilters.map((filter) => {
    return (
      <Grid item sm={6} md={3} lg={2} key={filter.title}>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel id="demo-multiple-checkbox-label-2">{filter.title}</InputLabel>
          <Select
            multiple
            value={filter.filter}
            onChange={(event) => handleFilterChange(event, filter.setFilter)}
            input={<OutlinedInput label={filter.title} />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            <MenuItem disabled value="">
              <em>{filter.title}</em>
            </MenuItem>
            {filter.choices.map((elem) => (
              <MenuItem key={elem} value={elem}>
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={0.25}
                >
                  <Checkbox checked={filter.filter.indexOf(elem) > -1} />
                  <ListItemText primary={elem} />
                  <ListItemText primary={filter.unit} />
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  });
}

export default CpuFilter_ALT;
