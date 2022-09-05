import AccountCircle from "@mui/icons-material/AccountCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Alert,
  AppBar,
  Autocomplete,
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import LoginPopup from "./LoginPopup";
import LogoutPopup from "./LogoutPopup";
import "./Popup.css";
import SignUpPopup from "./SignUpPopup";

export default function ApplicationBar(props) {
  let navigate = useNavigate();
  let location = useLocation();
  const { shoppingCart, premiumUser } = useContext(AppContext);
  const [options, setOptions] = useState([]);
  const [countAmount, setCountAmount] = useState(0);
  const [logoutButtonPopup, setLogoutButtonPopup] = useState(false);
  const [signUpButtonPopup, setSignUpButtonPopup] = useState(false);
  const [openSnackBarLogin, setOpenSnackBarLogin] = useState(false);
  const [openSnackBarSignUp, setOpenSnackBarSignUp] = useState(false);
  const [openSnackBarSignUpError, setOpenSnackBarSignUpError] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const logo = require("../../static/images/AirParts_Logo.png");
  const premiumIcon = require("../../static/images/premium_icon.png");

  const handleProfileMenuOpen = () => {
    navigate("/profile");
  };

  useEffect(() => {
    var amount = 0;
    for (var i = 0; i < shoppingCart.length; i++) {
      amount += shoppingCart[i].amount;
    }
    setCountAmount(amount);
  }, [shoppingCart]);

  // ------- Funktionalität der Searchbar ----------------------------------------------------------------------------------

  const filterOptions = createFilterOptions({
    limit: 5,
  });

  useEffect(() => {
    var resArray = [
      { id: 0, key: 0, label: "PC Configurator", to: "/configurator" },
      { id: 1, key: 1, label: "Graphic Card", to: "/shop/gpu" },
      { id: 2, key: 2, label: "Processor", to: "/shop/cpu" },
      { id: 3, key: 3, label: "Motherboard", to: "/shop/mainboard" },
      { id: 4, key: 4, label: "Case", to: "/shop/case" },
      { id: 5, key: 5, label: "Memory", to: "/shop/ram" },
      { id: 6, key: 6, label: "Drive", to: "/shop/drive" },
    ];

    var res = [];
    Axios.get(`http://localhost:8080/part/`).then((result) => {
      var counter = 7;
      res = result.data?.map((elem) => {
        counter = counter + 1;
        return {
          key: counter,
          id: counter,
          label: elem.name,
          to: "/productDetails/" + elem._id,
          elem: elem,
        };
      });
      setOptions(resArray.concat(res));
    });
  }, []);

  useEffect(() => {}, [location]);

  return (
    <Box margin={15}>
      <AppBar position="fixed">
        {/* ------------------- Premium Infobanner (Conditionally Displayed) ------------------------------*/}
        <Box
          className="premiumInfobar"
          sx={{ height: 25, width: "100%" }}
          display={premiumUser ? "none" : "block"}
        >
          <Typography className="textBar">
            Do you already know our Premium Membership? Free delivery, exclusive components and
            more.
            <Link to={"/subscription"} style={{ marginLeft: 5, color: "white" }}>
              Have a look here
            </Link>
            !
          </Typography>
        </Box>
        {/* ------------------- Premium Infobanner (Conditionally Displayed) ------------------------------*/}

        <Box
          className="greyInfobar"
          sx={{ height: "25%", width: "100%" }}
          display="flex"
          justifyContent="center"
        >
          <Box display="flex" flex={4} maxWidth={1440} justifyContent="flex-end">
            <Stack direction={"row"} spacing={1}>
              <Button className="infoButton" component={Link} to={"./blog"}>
                Blog
              </Button>
              <Button className="infoButton" component={Link} to={"./about"}>
                About us
              </Button>
              <Button className="infoButton" component={Link} to={"./contact"}>
                Contact
              </Button>
              <Button className="infoButton" component={Link} to={"./faq"}>
                FAQ
              </Button>
            </Stack>
          </Box>
        </Box>

        <Toolbar className="siteHeader">
          <Box flex={4} maxWidth={1440}>
            <Stack direction="row" alignItems="center">
              <IconButton
                size="large"
                edge="start"
                aria-label="open drawer"
                onClick={() => {
                  props.setOpen(true);
                }}
              >
                <MenuIcon />
              </IconButton>
              <Link to={"/"}>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <img className="companyLogo" src={logo} width={205} />
                </Box>
              </Link>
              <Link to={"/"}>
                <Box display={!premiumUser ? "none" : "block"} paddingLeft={1}>
                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <img className="companyLogo" src={premiumIcon} height={40.3} />
                  </Box>
                </Box>
              </Link>
              {/* ------------------- Searchbar ------------------------------*/}
              <Box flex={5} paddingLeft={5} paddingRight={5}>
                <Autocomplete
                  value={searchValue}
                  disablePortal
                  id="combo-box-demo"
                  options={options}
                  filterOptions={filterOptions}
                  clearOnEscape={true}
                  onChange={(e, elem) => {
                    if (elem) {
                      elem.elem
                        ? navigate(`${elem.to}`, { state: elem.elem })
                        : navigate(`${elem.to}`);
                    }
                  }}
                  renderInput={(params) => <TextField {...params} label="Search..." />}
                />
              </Box>
              {/* ------------------- Searchbar ------------------------------*/}

              {/* ------------------- Buttons (no User) ---------------------- */}
              <Stack
                direction={"row"}
                spacing={3}
                marginLeft={"auto"}
                sx={{ display: props.loginVisibility }}
              >
                <IconButton
                  size="large"
                  edge="end"
                  onClick={() => {
                    navigate("/shoppingCart");
                  }}
                >
                  <Badge color="primary" badgeContent={countAmount}>
                    <ShoppingCartIcon sx={{ fontSize: 35 }} />
                  </Badge>
                </IconButton>

                <Button variant="outlined" onClick={() => setSignUpButtonPopup(true)}>
                  Sign Up
                </Button>

                <Dialog
                  open={signUpButtonPopup}
                  onClose={() => setSignUpButtonPopup(!signUpButtonPopup)}
                  scroll="paper"
                  aria-labelledby="scroll-dialog-title"
                  aria-describedby="scroll-dialog-description"
                >
                  <DialogTitle id="scroll-dialog-title" align="center">
                    <Typography variant="h4">Sign Up</Typography>
                  </DialogTitle>
                  <DialogContent dividers>
                    <DialogContentText
                      id="scroll-dialog-description"
                      //   ref={descriptionElementRef}
                      tabIndex={-1}
                    >
                      <SignUpPopup
                        trigger={signUpButtonPopup}
                        setTrigger={setSignUpButtonPopup}
                        setChange={props.setLoginButtonPopup}
                        setOpenSnackBar={setOpenSnackBarSignUp}
                        setOpenSnackBarError={setOpenSnackBarSignUpError}
                        user={props.user}
                        setUser={props.setUser}
                      />
                    </DialogContentText>
                  </DialogContent>
                  {/* <DialogActions></DialogActions> */}
                </Dialog>

                <Dialog
                  open={props.loginButtonPopup}
                  onClose={() => props.setLoginButtonPopup(!props.loginButtonPopup)}
                  scroll="paper"
                  aria-labelledby="scroll-dialog-title"
                  aria-describedby="scroll-dialog-description"
                >
                  <DialogTitle id="scroll-dialog-title" align="center">
                    <Typography variant="h4">Log In</Typography>
                  </DialogTitle>
                  <DialogContent dividers>
                    <DialogContentText
                      id="scroll-dialog-description"
                      //   ref={descriptionElementRef}
                      tabIndex={-1}
                    >
                      <LoginPopup
                        trigger={props.loginButtonPopup}
                        setTrigger={props.setLoginButtonPopup}
                        setChange={setSignUpButtonPopup}
                        setOpenSnackBar={setOpenSnackBarLogin}
                        setLoginVisibility={props.setLoginVisibility}
                        setAccountVisibility={props.setAccountVisibility}
                        user={props.user}
                        setUser={props.setUser}
                      />
                    </DialogContentText>
                  </DialogContent>
                </Dialog>

                <Button variant="outlined" onClick={() => props.setLoginButtonPopup(true)}>
                  Login
                </Button>
              </Stack>
              {/* ------------------- Buttons (no User) ---------------------- */}

              {/* ------------------- Buttons (User & No Premium) ---------------------- */}
              <Stack
                direction={"row"}
                spacing={4}
                marginLeft={"auto"}
                sx={{
                  display: props.accountVisibility === "block" && !premiumUser ? "block" : "none",
                }}
              >
                <IconButton
                  size="large"
                  onClick={() => {
                    navigate("/shoppingCart");
                  }}
                >
                  <Badge color="primary" badgeContent={countAmount}>
                    <ShoppingCartIcon sx={{ fontSize: 35 }} />
                  </Badge>
                </IconButton>

                <IconButton size="large" edge="end" onClick={handleProfileMenuOpen}>
                  <AccountCircle sx={{ fontSize: 35 }} />
                </IconButton>

                <IconButton size="large" edge="end" onClick={() => setLogoutButtonPopup(true)}>
                  <LogoutIcon sx={{ fontSize: 35 }} />
                </IconButton>

                <Dialog
                  open={logoutButtonPopup}
                  onClose={() => setLogoutButtonPopup(!logoutButtonPopup)}
                  scroll="paper"
                  aria-labelledby="scroll-dialog-title"
                  aria-describedby="scroll-dialog-description"
                >
                  <DialogTitle id="scroll-dialog-title" align="center">
                    <Typography variant="h4">Log In</Typography>
                  </DialogTitle>
                  <DialogContent dividers>
                    <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                      <LogoutPopup
                        trigger={logoutButtonPopup}
                        setTrigger={setLogoutButtonPopup}
                        setLoginVisibility={props.setLoginVisibility}
                        setAccountVisibility={props.setAccountVisibility}
                        setUser={props.setUser}
                      />
                    </DialogContentText>
                  </DialogContent>
                </Dialog>
              </Stack>
              {/* ------------------- Buttons (User & No Premium) ---------------------- */}

              {/* ------------------- Buttons (User & Premium) ---------------------- */}
              <Stack
                direction={"row"}
                spacing={4}
                marginLeft={"auto"}
                sx={{
                  display: props.accountVisibility === "block" && premiumUser ? "block" : "none",
                }}
              >
                <IconButton
                  size="large"
                  onClick={() => {
                    navigate("/shoppingCart");
                  }}
                >
                  <Badge color="primary" badgeContent={countAmount}>
                    <ShoppingCartIcon sx={{ fontSize: 35 }} />
                  </Badge>
                </IconButton>

                <IconButton size="large" onClick={handleProfileMenuOpen} color={"primary"}>
                  <AccountCircle sx={{ fontSize: 35 }} />
                </IconButton>

                <IconButton size="large" edge="end" onClick={() => setLogoutButtonPopup(true)}>
                  <LogoutIcon sx={{ fontSize: 35 }} />
                </IconButton>

                <Dialog
                  open={logoutButtonPopup}
                  onClose={() => setLogoutButtonPopup(!logoutButtonPopup)}
                  scroll="paper"
                  aria-labelledby="scroll-dialog-title"
                  aria-describedby="scroll-dialog-description"
                >
                  <DialogTitle id="scroll-dialog-title" align="center">
                    <Typography variant="h4">Log Out</Typography>
                  </DialogTitle>
                  <DialogContent dividers>
                    <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                      <LogoutPopup
                        trigger={logoutButtonPopup}
                        setTrigger={setLogoutButtonPopup}
                        setLoginVisibility={props.setLoginVisibility}
                        setAccountVisibility={props.setAccountVisibility}
                        setUser={props.setUser}
                      />
                    </DialogContentText>
                  </DialogContent>
                </Dialog>
              </Stack>
              {/* ------------------- Buttons (User & Premium) ---------------------- */}
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ------------------- Snackbar SignUp Successful ---------------------- */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackBarSignUp}
        autoHideDuration={1500}
        onClose={() => {
          setOpenSnackBarSignUp(false);
        }}
      >
        <Alert
          onClose={() => setOpenSnackBarSignUp(false)}
          severity="success"
          sx={{ width: "100%" }}
          icon={<CheckCircleOutlineIcon fontSize={"large"} />}
        >
          <Typography variant="h5">You registered successfully!</Typography>
        </Alert>
      </Snackbar>

      {/* ------------------- Snackbar Login Successful ---------------------- */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackBarLogin}
        autoHideDuration={1500}
        onClose={() => {
          setOpenSnackBarLogin(false);
        }}
      >
        <Alert
          onClose={() => setOpenSnackBarLogin(false)}
          severity="success"
          sx={{ width: "100%" }}
          icon={<CheckCircleOutlineIcon fontSize={"large"} />}
        >
          <Typography variant="h5">You logged in successfully!</Typography>
        </Alert>
      </Snackbar>

      {/* ------------------- Snckbar Signup Unsuccessful ---------------------- */}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackBarSignUpError}
        autoHideDuration={1500}
        onClose={() => {
          {
            setOpenSnackBarSignUpError(false);
          }
        }}
      >
        <Alert
          onClose={() => setOpenSnackBarSignUpError(false)}
          severity="error"
          sx={{ width: "100%" }}
          icon={<ErrorOutlineOutlinedIcon fontSize={"large"} />}
        >
          <Typography variant="h5">Email already has an existing account!</Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
}
