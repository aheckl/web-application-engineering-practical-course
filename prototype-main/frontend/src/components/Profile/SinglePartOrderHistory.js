import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const SinglePartOrderHistory = ({ part }) => {
  const { shoppingCart, setShoppingCart } = useContext(AppContext);

  let navigate = useNavigate();

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
      <Stack direction="column" justifyContent="space-between" alignItems="flex-start" width={355}>
        <Typography variant="h5">{part.name}</Typography>
        <Typography>{part.duration} month rent</Typography>
      </Stack>
      <Stack direction="column" justifyContent="space-between" alignItems="flex-end" spacing={2}>
        <Typography variant="body1">{part.prices?.[part.duration]} € / month </Typography>
        <Typography variant="body1">Amount: {part.amount}</Typography>
        <Typography variant="body1">Deposit: {part.prices?.[part.duration]} € </Typography>
      </Stack>
    </Stack>
  );
};

export default SinglePartOrderHistory;
