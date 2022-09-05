import { Stack, Typography } from "@mui/material";
import React from "react";
import ConfigurationOrderHisory from "./ConfigurationOrderHistory";
import SinglePartOrderHistory from "./SinglePartOrderHistory";

export default function OrderHistory({ order }) {
  return (
    <Stack
      direction="column"
      spacing={7}
      justifyContent="center"
      alignItems="flex-start"
      padding={2}
    >
      <Typography variant="h4">{order.date.slice(0, 10)}</Typography>
      {order.products.map((elem) => {
        return elem.configuration ? (
          <ConfigurationOrderHisory configuration={elem} />
        ) : (
          <SinglePartOrderHistory part={elem} />
        );
      })}
    </Stack>
  );
}
