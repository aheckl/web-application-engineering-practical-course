import { AppContext } from "../../Context/AppContext";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { IconButton } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

const ConfigurationSummary = ({ configuration }) => {
  const { shoppingCart, setShoppingCart } = useContext(AppContext);

  let navigate = useNavigate();

  const handleDeleteItem = () => {
    var handleShoppingCart = [];

    for (let i = 0; i < shoppingCart.length; i++) {
      if (
        shoppingCart[i]._id != configuration._id ||
        shoppingCart[i].rentingTime != configuration.rentingTime
      ) {
        handleShoppingCart.push(shoppingCart[i]);
      }
    }

    Cookies.remove("productsInShoppingCart");

    if (handleShoppingCart.length > 0) {
      Cookies.set("productsInShoppingCart", JSON.stringify(handleShoppingCart));
    }
    setShoppingCart(handleShoppingCart);
  };

  const handleAmountChange = (i) => {
    if (!(configuration.amount == 1 && i == -1)) {
      var x = shoppingCart.find((elem) => elem._id == configuration._id)?.amount;

      var confNew = { ...configuration };
      confNew.amount = x + i;

      var configurationIDs = {};
      Object.keys(configuration.configuration).forEach((key) => {
        configurationIDs[key] = configuration.configuration[key]._id;
      });
      confNew.configuration = configurationIDs;

      var tempCart = [...shoppingCart.filter((elem) => elem._id != configuration._id), confNew];
      setShoppingCart(tempCart);

      Cookies.remove("productsInShoppingCart");
      if (tempCart.length > 0) {
        Cookies.set("productsInShoppingCart", JSON.stringify(tempCart));
      }
    }
  };

  const handleClick = (type) => {
    navigate("/configurator");
  };

  return (
    <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="stretch">
      <img
        src={require("/public/cards/all/" + configuration.configuration.case.cardImage)}
        width="350"
        onClick={handleClick}
      ></img>
      <Stack direction="column" justifyContent="space-between" alignItems="flex-start" width={350}>
        <Typography variant="h4">Your Configuration:</Typography>

        <Typography variant="h6">{configuration.configuration.cpu.name}</Typography>
        <Typography variant="h6">{configuration.configuration.gpu.name}</Typography>
        <Typography variant="h6">{configuration.configuration.ram.name}</Typography>
        <Typography variant="h6">{configuration.configuration.mainboard.name}</Typography>
        <Typography variant="h6">{configuration.configuration.case.name}</Typography>
        <Typography variant="h6">{configuration.configuration.drive.name}</Typography>

        <Typography>{configuration.rentingTime} month rent</Typography>

        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          onClick={() => handleDeleteItem()}
        >
          <IconButton>
            <DeleteForeverIcon />
          </IconButton>
          <Typography color="gray" variant="body2">
            Remove
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="column" justifyContent="space-between" alignItems="flex-end" spacing={2}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.1}>
          <IconButton>
            <RemoveCircleOutlineOutlinedIcon onClick={() => handleAmountChange(-1)} />
          </IconButton>
          <Typography>{configuration.amount}</Typography>
          <IconButton onClick={() => handleAmountChange(1)}>
            <AddCircleOutlineOutlinedIcon />
          </IconButton>
        </Stack>
        <Typography variant="body1">
          {configuration.prices?.[configuration.rentingTime]} € / month{" "}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default ConfigurationSummary;
