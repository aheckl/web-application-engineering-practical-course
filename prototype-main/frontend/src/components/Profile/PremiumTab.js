import { Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const PremiumTab = () => {
  let navigate = useNavigate();
  const { user, profile } = useContext(AppContext);
  const [subscriptionPrice, setSubscriptionPrice] = useState();
  const [subscriptionInterval, setSubscriptionInterval] = useState();
  const [periodEndDate, setPeriodEndDate] = useState();
  const [subscriptionUnsubscribed, setSubscriptionUnsubscribed] = useState();

  const config = {
    headers: { Authorization: `Bearer ${user}` },
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleUnsubscribe = () => {
    let subscription = { subscriptionId: profile.subscriptionInfo.subscriptionId };
    axios
      .post("http://localhost:8080/subscription/unsubscribe", subscription, config)
      .then((res) => {
        if (res.status === 200) {
          // setPremiumUser(false);
          navigate("/?unsubscribe=true");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchSubscription = async () => {
    const subscriptionId = profile.subscriptionInfo.subscriptionId;
    config.params = { subscriptionId: subscriptionId };
    const response = await axios
      .get("http://localhost:8080/subscription/details", config)
      .catch((err) => {
        console.log(err);
      });
    const date = new Date(response.data.current_period_end * 1000);
    setPeriodEndDate(date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear());
    setSubscriptionPrice(response.data.plan.amount / 100);
    setSubscriptionInterval(response.data.plan.interval);
    setSubscriptionUnsubscribed(response.data.status);
  };

  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={2}>
      <Typography>Your Premium Membership subscription is valid until: {periodEndDate}</Typography>
      <Typography>
        {!subscriptionUnsubscribed === "canceled"
          ? "Your membership will automatically renew itself for another " +
            subscriptionInterval +
            " at a price of " +
            subscriptionPrice +
            "€"
          : "You have unsubscribed from the AirParts Premium Membership. You will keep your benefits until the end of the period you have already paid for."}
      </Typography>
      {subscriptionUnsubscribed === "canceled" ? (
        <Button
          sx={{ maxWidth: "25%" }}
          variant={"outlined"}
          disabled
          onClick={() => handleUnsubscribe()}
        >
          Unsubscribed
        </Button>
      ) : (
        <Button sx={{ maxWidth: "25%" }} variant={"outlined"} onClick={() => handleUnsubscribe()}>
          Unsubscribe
        </Button>
      )}
      <Button variant={"outlined"} href="/subscription/details">
        Read about your benefits
      </Button>
    </Stack>
  );
};

export default PremiumTab;
