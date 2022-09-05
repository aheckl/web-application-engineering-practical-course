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

function MemoryFilter({ manufacturerFilter, productType, setSpecificQuery }) {
  const [driveTypes, setdriveTypes] = useState([]);
  const [driveTypeFilter, setdriveTypeFilter] = useState([]);

  const [readSpeeds, setreadSpeeds] = useState([]);
  const [readSpeedFilter, setreadSpeedFilter] = useState([]);

  const [writeSpeeds, setwriteSpeeds] = useState([]);
  const [writeSpeedFilter, setwriteSpeedFilter] = useState([]);

  const [driveCapacitys, setDriveCapacitys] = useState([]);
  const [driveCapacityFilter, setdriveCapacityFilter] = useState([]);

  useEffect(() => {
    updateAttributeOptions();
  }, []);

  useEffect(() => {
    setSpecificQuery({
      readSpeed: readSpeedFilter,
      driveType: driveTypeFilter,
      driveCapacity: driveCapacityFilter,
      writeSpeed: writeSpeedFilter,
    });
  }, [driveTypeFilter, readSpeedFilter, driveCapacityFilter, writeSpeedFilter]);

  useEffect(() => {
    setdriveTypeFilter([]);
    setreadSpeedFilter([]);
    setdriveCapacityFilter([]);
    setwriteSpeedFilter([]);
  }, [manufacturerFilter]);

  const handleFilterChange = (event, setter) => {
    const {
      target: { value },
    } = event;
    setter(typeof value === "string" ? value.split(",") : value);
  };

  const updateAttributeOptions = () => {
    const seriesQuery = { manufacturer: manufacturerFilter };
    fetchAttributeOptions("readSpeed", setreadSpeeds, seriesQuery);
    fetchAttributeOptions("driveType", setdriveTypes, seriesQuery);
    fetchAttributeOptions("driveCapacity", setDriveCapacitys, seriesQuery);
    fetchAttributeOptions("writeSpeed", setwriteSpeeds, seriesQuery);
  };

  const fetchAttributeOptions = (attribute, setter, query) => {
    Axios.get(`http://localhost:8080/part/${productType}/${attribute}`, {
      pareadSpeeds: query,
    }).then((result) => {
      setter(result.data);
    });
  };

  const selectFilters = [
    {
      title: "Read Speed",
      setFilter: setreadSpeedFilter,
      filter: readSpeedFilter,
      choices: readSpeeds,
      unit: "MB/s",
    },
    {
      title: "Write Speed",
      setFilter: setwriteSpeedFilter,
      filter: writeSpeedFilter,
      choices: writeSpeeds,
      unit: "MB/s",
    },
    {
      title: "Drive Type",
      setFilter: setdriveTypeFilter,
      filter: driveTypeFilter,
      choices: driveTypes,
    },
    {
      title: "Drive Capacity",
      setFilter: setdriveCapacityFilter,
      filter: driveCapacityFilter,
      choices: driveCapacitys,
      unit: "GB",
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

export default MemoryFilter;
