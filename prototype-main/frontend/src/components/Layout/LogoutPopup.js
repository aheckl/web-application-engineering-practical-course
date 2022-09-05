import { Box, Button, Stack, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import "./Popup.css";

function LogoutPopup(props) {
  let navigate = useNavigate();
  const { shoppingCart, setShoppingCart, setPremiumUser } = useContext(AppContext);

  const handleLogout = () => {
    props.setUser("");
    props.setAccountVisibility("none");
    props.setLoginVisibility("block");
    props.setTrigger(!props.trigger);
    setPremiumUser(false);
    Cookies.remove("user");
    Cookies.remove("accountVisibility");
    Cookies.remove("loginVisibility");
    if (shoppingCart.length > 0) {
      Cookies.remove("productsInShoppingCart");
      setShoppingCart([]);
    }
    navigate("/");
  };

  return props.trigger ? (
    <Box flex={5}>
      <Box>
        <Stack direction={"column"} spacing={2}>
          <Typography variant="h6">Do you want to log out?</Typography>

          <Stack
            className="boxButtons"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Button
              className="clsButton"
              variant="contained"
              onClick={() => props.setTrigger(!props.trigger)}
            >
              Cancel
            </Button>
            <Button className="logout" variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  ) : (
    ""
  );
}

export default LogoutPopup;
