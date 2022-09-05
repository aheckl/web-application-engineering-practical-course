import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate } from "react-router-dom";

const ConfigurationOrderHisory = ({ configuration }) => {
  let navigate = useNavigate();

  return (
    <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="stretch">
      <img
        //case: is 4th -> use as config preview pic
        src={require("/public/cards/all/" + configuration.configuration[3].cardImage)}
        width="350"
        // onClick={handleClick}
      ></img>
      <Stack direction="column" justifyContent="space-between" alignItems="flex-start" width={350}>
        <Typography variant="h5">Your Configuration:</Typography>
        {configuration.configuration.map((part) => (
          <Typography>{part.name}</Typography>
        ))}
        <Typography>{configuration.duration} month rent</Typography>
      </Stack>
      <Stack direction="column" justifyContent="space-between" alignItems="flex-end" spacing={2}>
        <Typography variant="body1">{configuration.price} € / month</Typography>
        <Typography variant="body1">Amount: {configuration.amount}</Typography>
        <Typography variant="body1">Deposit: {configuration.price} €</Typography>
      </Stack>
    </Stack>
  );
};

export default ConfigurationOrderHisory;
