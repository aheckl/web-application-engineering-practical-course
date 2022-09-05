import { Button, Divider, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import SummaryLine from "./SummaryLine";

function shoppingCartSummary({
  user,
  premiumUser,
  costOfProduct,
  costOfDeposit,
  dateDelivery,
  setLoginButtonPopup,
  setCheckOutRequested,
}) {
  const handleRequestCheckOut = () => {
    if (user) {
      setCheckOutRequested(true);
    } else {
      setLoginButtonPopup(true);
    }
  };
  return (
    <Stack spacing={2}>
      <Stack bgcolor="white" padding={2} spacing={2}>
        <Typography variant="h5">Total</Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Typography>Subtotal</Typography>
          <Typography>{(costOfProduct / 1.19).toFixed(2)} €</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Typography>VAT(19%)</Typography>
          <Typography>{(costOfProduct - costOfProduct / 1.19).toFixed(2)} €</Typography>
        </Stack>
        <Divider variant="middle" />
        <SummaryLine lineTitle={"First monthly payment"} lineValue={costOfProduct + " €"} />
        <SummaryLine lineTitle={"One time deposit"} lineValue={costOfDeposit + " €"} />
        {!premiumUser ? (
          <SummaryLine lineTitle={"Shipping Cost"} lineValue={"4 €"} />
        ) : (
          <SummaryLine lineTitle={"Free Shipping (Premium)"} lineValue={"0 €"}></SummaryLine>
        )}

        <Divider variant="middle" />
        <SummaryLine
          lineTitle={"Total initial payment"}
          lineValue={costOfProduct + costOfDeposit + (!premiumUser ? 4 : 0) + " €"}
        />

        <Button variant="contained" sx={{ width: 250 }} onClick={() => handleRequestCheckOut()}>
          Continue with Checkout
        </Button>
      </Stack>
      <Stack bgcolor="white" padding={2} spacing={2}>
        <Typography variant="h5">Estimated Delivery</Typography>
        <Typography variant="body2">{dateDelivery}</Typography>
      </Stack>
    </Stack>
  );
}

export default shoppingCartSummary;
