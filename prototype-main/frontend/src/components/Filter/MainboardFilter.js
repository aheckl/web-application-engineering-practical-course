import {
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
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

function MainboardFilter({ manufacturerFilter, productType, setSpecificQuery }) {
  const [MainboardChipsets, setMainboardChipsets] = useState([]);
  const [MainboardChipsetFilter, setMainboardChipsetFilter] = useState([]);

  const [cpuSockets, setcpuSockets] = useState([]);
  const [cpuSocketFilter, setcpuSocketFilter] = useState([]);

  useEffect(() => {
    updateAttributeOptions();
  }, []);

  useEffect(() => {
    setSpecificQuery({
      cpuSocket: cpuSocketFilter,
      mainboardChipset: MainboardChipsetFilter,
    });
  }, [MainboardChipsetFilter, cpuSocketFilter]);

  useEffect(() => {
    setMainboardChipsetFilter([]);
    setcpuSocketFilter([]);
  }, [manufacturerFilter]);

  const handleFilterChange = (event, setter) => {
    const {
      target: { value },
    } = event;
    setter(typeof value === "string" ? value.split(",") : value);
  };

  const updateAttributeOptions = () => {
    const seriesQuery = { manufacturer: manufacturerFilter };
    fetchAttributeOptions("cpuSocket", setcpuSockets, seriesQuery);
    fetchAttributeOptions("mainboardChipset", setMainboardChipsets, seriesQuery);
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
      title: "Mainboard Chipset",
      setFilter: setMainboardChipsetFilter,
      filter: MainboardChipsetFilter,
      choices: MainboardChipsets,
    },
    {
      title: "Mainboard Socket",
      setFilter: setcpuSocketFilter,
      filter: cpuSocketFilter,
      choices: cpuSockets,
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
                <Checkbox checked={filter.filter.indexOf(elem) > -1} />
                <ListItemText primary={elem} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  });
}

export default MainboardFilter;
