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

const SingleProductSummary = ({ part }) => {
  const { shoppingCart, setShoppingCart } = useContext(AppContext);

  let navigate = useNavigate();

  const handleDeleteItem = () => {
    var handleShoppingCart = [];

    for (let i = 0; i < shoppingCart.length; i++) {
      if (shoppingCart[i]._id != part._id || shoppingCart[i].rentingTime != part.rentingTime) {
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
    if (!(part.amount == 1 && i == -1)) {
      var x = shoppingCart.filter(
        (elem) => elem._id == part._id && elem.rentingTime == part.rentingTime
      )[0]?.amount;

      var item = {
        _id: part._id,
        amount:
          shoppingCart.filter(
            (elem) => elem._id == part._id && elem.rentingTime == part.rentingTime
          )[0]?.amount + i,
        rentingTime: part.rentingTime,
      };
      var filtered = shoppingCart.filter(
        (elem) => !(elem._id == part._id && elem.rentingTime == part.rentingTime)
      );

      setShoppingCart([...filtered, item]);

      Cookies.remove("productsInShoppingCart");
      if (shoppingCart.length > 0) {
        Cookies.set("productsInShoppingCart", JSON.stringify(shoppingCart));
      }
    }
  };

  const handleClick = (type) => {
    let state = { ...part, configuratorActive: false };
    navigate("/productDetails/" + part._id, {
      state: state,
    });
  };

  return (
    <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="stretch">
      <img
        src={require("/public/cards/all/" + part.cardImage)}
        width="350"
        onClick={handleClick}
      ></img>
      <Stack direction="column" justifyContent="space-between" alignItems="flex-start" width={375}>
        <Typography variant="h6">{part.name}</Typography>

        <Typography>{part.rentingTime} month rent</Typography>

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
          <Typography>{part.amount}</Typography>
          <IconButton onClick={() => handleAmountChange(+1)}>
            <AddCircleOutlineOutlinedIcon />
          </IconButton>
        </Stack>
        <Typography variant="body1">{part.prices?.[part.rentingTime]} € / month </Typography>
      </Stack>
    </Stack>
  );
};

export default SingleProductSummary;
