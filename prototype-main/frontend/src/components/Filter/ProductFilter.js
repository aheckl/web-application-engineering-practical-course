import SortIcon from "@mui/icons-material/Sort";
import {
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import RentingTimeInput from "../RentingTimeInput";
import CaseFilter from "./CaseFilter";
import CpuFilter from "./CpuFilter";
import DriveFilter from "./DriveFilter";
import GpuFilter from "./GpuFilter";
import MainboardFilter from "./MainboardFilter";
import MemoryFilter from "./MemoryFilter";

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

function ProductFilter({ products, setProducts, productType }) {
  const { configuration, configurationDuration, setConfigurationDuration } = useContext(AppContext);
  const [specificQuery, setSpecificQuery] = useState({});
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(999);

  const [manufacturers, setManufacturers] = useState([]);

  const [sortBy, setSortBy] = useState("Sort");
  const [priceRange, setPriceRange] = useState([0, 0]);
  const handlePriceRangeChange = (event) => {
    setPriceRange(event.target.value);
  };

  const [series, setSeries] = useState([]);
  const [seriesFilter, setSeriesFilter] = useState([]);

  const [manufacturerFilter, setManufacturerFilter] = useState([]);

  //gets triggerd when any of the filter changes

  useEffect(() => {
    const seriesQuery = { manufacturer: manufacturerFilter };
    fetchAttributeOptions("manufacturer", setManufacturers);
    fetchAttributeOptions("series", setSeries, seriesQuery);
    handleFilterCommit();
  }, [manufacturerFilter, seriesFilter, specificQuery]);

  useEffect(() => {
    setManufacturerFilter([]);
    setSeriesFilter([]);
    setPriceRange([0, 1000]);

    Axios.get(`http://localhost:8080/part/${productType}/pricerange`, {
      params: { duration: configurationDuration },
    }).then((result) => {
      setPriceMin(result.data.priceMin);
      if (result.data.priceMax - result.data.priceMin < 1) {
        setPriceMax(result.data.priceMin + 1);
        setPriceRange([result.data.priceMin, result.data.priceMax + 1]);
      } else {
        setPriceMax(result.data.priceMax);
        setPriceRange([result.data.priceMin, result.data.priceMax]);
      }
    });

    const seriesQuery = { manufacturer: manufacturerFilter };
    fetchAttributeOptions("manufacturer", setManufacturers);
    fetchAttributeOptions("series", setSeries, seriesQuery);

    Axios.get(`http://localhost:8080/part/${productType}`, {
      params: {
        priceLow: priceRange[0],
        priceHigh: priceRange[1],
        manufacturer: manufacturerFilter,
        series: seriesFilter,
        duration: configurationDuration,
      },
    })
      .then((result) => {
        setProducts(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [productType, configurationDuration]);

  const handleFilterChange = (event, setter) => {
    const {
      target: { value },
    } = event;
    setter(typeof value === "string" ? value.split(",") : value);
  };

  const handleManufacturer = (event) => {
    handleFilterChange(event, setManufacturerFilter);
    setSeriesFilter([]);
  };

  const fetchAttributeOptions = (attribute, setter, query) => {
    Axios.get(`http://localhost:8080/part/${productType}/${attribute}`, {
      params: query,
    }).then((result) => {
      setter(result.data);
    });
  };

  const handleFilterCommit = () => {
    const generalParams = {
      priceLow: priceRange[0],
      priceHigh: priceRange[1],
      manufacturer: manufacturerFilter,
      series: seriesFilter,
      duration: configurationDuration,
    };

    const totalParams = { ...generalParams, ...specificQuery };

    Axios.get(`http://localhost:8080/part/${productType}`, {
      params: totalParams,
    })
      .then((result) => {
        setProducts(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //SORTING:

  function valuetext(value) {
    return `${value}€`;
  }

  const comparePrice = (a, b) => {
    return parseInt(a.price) - parseInt(b.price);
  };

  const getAverageRating = (product) => {
    return product.reviews
      ? product.reviews.reduce((count, review) => {
          return review.rating + count;
        }, 0) / product.reviews.length
      : 0;
  };
  const compareRating = (a, b) => {
    return getAverageRating(a) - getAverageRating(b);
  };

  function handleSortByChange(event) {
    setSortBy(event.target.value);
    switch (event.target.value) {
      case "priceAsc":
        return setProducts([...products].sort(comparePrice));
      case "priceDesc":
        return setProducts([...products].sort(comparePrice).reverse());
      case "ratingAsc":
        return setProducts([...products].sort(compareRating));
      case "ratingDesc":
        return setProducts([...products].sort(compareRating).reverse());
      default:
        return;
    }
  }

  const selecFilterComponent = (type) => {
    switch (type) {
      case "cpu":
        return (
          <CpuFilter
            products={products}
            setProducts={setProducts}
            productType={productType}
            manufacturerFilter={manufacturerFilter}
            specificQuery={specificQuery}
            setSpecificQuery={setSpecificQuery}
          />
        );
      case "gpu":
        return (
          <GpuFilter
            products={products}
            setProducts={setProducts}
            productType={productType}
            manufacturerFilter={manufacturerFilter}
            specificQuery={specificQuery}
            setSpecificQuery={setSpecificQuery}
          />
        );
      case "ram":
        return (
          <MemoryFilter
            products={products}
            setProducts={setProducts}
            productType={productType}
            manufacturerFilter={manufacturerFilter}
            specificQuery={specificQuery}
            setSpecificQuery={setSpecificQuery}
          />
        );
      case "drive":
        return (
          <DriveFilter
            products={products}
            setProducts={setProducts}
            productType={productType}
            manufacturerFilter={manufacturerFilter}
            specificQuery={specificQuery}
            setSpecificQuery={setSpecificQuery}
          />
        );
      case "mainboard":
        return (
          <MainboardFilter
            products={products}
            setProducts={setProducts}
            productType={productType}
            manufacturerFilter={manufacturerFilter}
            specificQuery={specificQuery}
            setSpecificQuery={setSpecificQuery}
          />
        );
      case "case":
        return (
          <CaseFilter
            products={products}
            setProducts={setProducts}
            productType={productType}
            manufacturerFilter={manufacturerFilter}
            specificQuery={specificQuery}
            setSpecificQuery={setSpecificQuery}
          />
        );
      default:
        return;
    }
  };

  const selectFilters = [
    {
      title: "Manufacturer",
      setFilter: setManufacturerFilter,
      filter: manufacturerFilter,
      choices: manufacturers,
    },
    {
      title: "Series",
      setFilter: setSeriesFilter,
      filter: seriesFilter,
      choices: series,
    },
  ];

  const handleRentingTimeChange = (event) => {
    setConfigurationDuration(event.target.value);
  };

  return (
    <Box flex={1} padding={5}>
      <Stack alignItems="flex-start">
        <Stack direction="row" maxWidth="50%">
          <Box flex={1} paddingLeft={2} paddingBottom={3}>
            <Stack direction="column">
              <Typography variant="h6">Price Range [€]:</Typography>
              <Slider
                getAriaLabel={() => "Price Range"}
                value={priceRange}
                onChange={handlePriceRangeChange}
                onChangeCommitted={handleFilterCommit}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                min={priceMin}
                max={priceMax}
                disableSwap
                sx={{ maxWidth: "100%" }}
              />
              <Stack direction="row" padding={2} spacing={10} justifyContent={"space-around"}>
                <TextField
                  id="outlined-number"
                  type="number"
                  value={priceRange[0]}
                  onChange={(event) => {
                    if (event.target.value >= 0) {
                      setPriceRange([event.target.value, priceRange[1]]);
                      handleFilterCommit();
                    }
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                  style={{ width: 100 }}
                />
                <TextField
                  id="outlined-number"
                  type="number"
                  value={priceRange[1]}
                  onChange={(event) => {
                    if (event.target.value >= 0) {
                      setPriceRange([priceRange[0], event.target.value]);
                      handleFilterCommit();
                    }
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                  style={{ width: 100 }}
                />
              </Stack>
            </Stack>
          </Box>
          <Box padding={5}>
            <RentingTimeInput
              rentingTime={configurationDuration}
              handleChange={handleRentingTimeChange}
            />
          </Box>
        </Stack>
      </Stack>

      <Grid container spacing={1}>
        <Grid item sm={6} md={3} lg={2} key={1}>
          <Select
            labelId="sort"
            value={sortBy}
            onChange={handleSortByChange}
            IconComponent={() => <SortIcon sx={{ m: 1 }} />}
            sx={{ width: "100%" }}
          >
            <MenuItem disabled value="Sort">
              <em>Sort By</em>
            </MenuItem>
            <MenuItem value={"priceAsc"}>Price ascending</MenuItem>
            <MenuItem value={"priceDesc"}>Price desceding</MenuItem>
            <MenuItem value={"ratingAsc"}>Rating ascending</MenuItem>
            <MenuItem value={"ratingDesc"}>Rating desceding</MenuItem>
          </Select>
        </Grid>

        {selectFilters.map((filter) => {
          return (
            <Grid item sm={6} md={3} lg={2} key={filter.title}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-checkbox-label-2">{filter.title}</InputLabel>
                <Select
                  multiple
                  value={filter.filter}
                  onChange={(event) => {
                    filter.title === "Manufacturer"
                      ? handleManufacturer(event)
                      : handleFilterChange(event, filter.setFilter);
                  }}
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
        })}

        {selecFilterComponent(productType)}
        {/* </Stack> */}
      </Grid>
    </Box>
  );
}

export default ProductFilter;
