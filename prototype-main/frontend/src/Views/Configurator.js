import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Link,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { React, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ConfiguratorPartsTable from "../components/Configurator/ConfiguratorPartsTable";
import ConfiguratorSummaryTable from "../components/Configurator/ConfiguratorSummaryTable";
import RentingTimeInput from "../components/RentingTimeInput";
import { AppContext } from "../Context/AppContext";

const Configurator = () => {
  const {
    configuration,
    setConfiguration,
    setConfigurationDuration,
    configurationDuration,
    shoppingCart,
    setShoppingCart,
  } = useContext(AppContext);
  const [psu, setPsu] = useState();
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const totalPrice = (duration) => {
    return (
      (Object.keys(configuration).reduce(
        (sum, item) => (configuration[item] ? configuration[item].prices?.[duration] : 0) + sum,
        0
      ) +
        psu?.prices?.[duration]) *
      0.95
    ).toFixed(2);
  };

  const handleAddToCart = () => {
    var prices = {};
    [1, 2, 3, 6, 12, 18].forEach((duration) => {
      prices[duration] = totalPrice(duration);
    });

    var configurationIDs = {};
    Object.keys(configuration).forEach((key) => {
      configurationIDs[key] = configuration[key]._id;
    });

    var configurationItem = {
      _id: uuidv4(),
      amount: 1,
      rentingTime: configurationDuration,
      configuration: configurationIDs,
      prices: prices,
    };

    var tempCart = [...shoppingCart, configurationItem];
    setShoppingCart(tempCart);

    Cookies.set("productsInShoppingCart", JSON.stringify(tempCart), { expires: 1 });
    setOpenSnackBar(true);
  };

  const handleChange = (event) => {
    setConfigurationDuration(event.target.value);
  };
  return (
    <Box flex={6} paddingTop={2}>
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">Configurator</Typography>
        </Breadcrumbs>
      </Box>
      <Typography paddingBottom={1} variant="h3" align="left" sx={{ color: "#3D80E1" }}>
        PC Configurator
      </Typography>
      {/* <Typography>{JSON.stringify(configuration)}</Typography> */}
      <Stack spacing={4} direction="column" justifyContent="flex-start" alignItems="flex-start">
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">How does the PC Configurator work?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paddingBottom={1}>
              Our configurator is a tool that helps you to put toghether all the necessary
              components of an entire PC. In the configuration area below, each line represents one
              component. Once you have selected all the components, you can add them to the shopping
              cart. We'll do the assembly for you, so you can start using your new PC right away.
            </Typography>
            <Typography>
              What's special about our configurator is that it prevents you from buying incompatible
              components. For example, if you first choose a processor with AM4 socket and then a
              motherboard with a different CPU socket, you will get a hint in the table below. Also,
              once you select all the other components, a suitable power supply will be added
              automatically, so you don't have to calculate the energy consumption of your
              configuration yourself.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <ConfiguratorPartsTable shoppingCart setPsu={setPsu} psu={psu} />
        <RentingTimeInput rentingTime={configurationDuration} handleChange={handleChange} />
        <ConfiguratorSummaryTable setPsu={setPsu} psu={psu} />
        <Typography>{configuration.duration}</Typography>
        <Button
          variant="contained"
          onClick={handleAddToCart}
          disabled={
            !(
              configuration.cpu &&
              configuration.gpu &&
              configuration.drive &&
              configuration.case &&
              configuration.ram &&
              configuration.mainboard
            )
          }
        >
          Add Configuration to Cart
        </Button>
      </Stack>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackBar}
        autoHideDuration={1500}
        onClose={() => {
          setOpenSnackBar(false);
        }}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          severity="success"
          sx={{ width: "100%" }}
          icon={<CheckCircleOutlineIcon fontSize={"large"} />}
        >
          <Typography variant="h5">Added configuration to cart</Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Configurator;
