import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Alert, Box, Divider, Snackbar, Stack, Tab, Typography } from "@mui/material";
import Axios from "axios";
import { React, useContext, useEffect, useState } from "react";
import OrderHistory from "../components/Profile/OrderHistory";
import PasswordChange from "../components/Profile/PasswordChange";
import PremiumTab from "../components/Profile/PremiumTab";
import ProfileSummary from "../components/Profile/ProfileSummary";
import { AppContext } from "../Context/AppContext";

function Profile() {
  const [orders, setOrders] = useState();

  const [successfulChanged, setSuccessfulChanged] = useState(false);
  const [unsuccessfulChange, setUnsuccessfulChange] = useState(false);

  const { user, premiumUser, profile, setProfile } = useContext(AppContext);
  const config = { headers: { authorization: `Bearer ${user}` } };
  const [activeTab, setActiveTab] = useState("0");

  useEffect(() => {
    Axios.get(`http://localhost:8080/user/profile/orders`, config)
      .then((result) => {
        setOrders(result.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });

    Axios.get(`http://localhost:8080/user/profile`, config)
      .then((result) => {
        setProfile(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Box flex={8} paddingTop={5}>
      <Box bgcolor="white">
        <TabContext value={activeTab}>
          <Box paddingBottom={3} minWidth={1000}>
            <TabList
              aria-label="profile-tabs"
              onChange={(event, newValue) => {
                setActiveTab(newValue);
              }}
            >
              <Tab label="Profile Details" value="0"></Tab>
              <Tab label="Order History" value="1"></Tab>
              {premiumUser ? <Tab label="Premium" value="2"></Tab> : ""}
            </TabList>
          </Box>

          <TabPanel value="0">
            <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
              <ProfileSummary
                setSuccessfulChanged={setSuccessfulChanged}
                setUnsuccessfulChange={setUnsuccessfulChange}
              />
              <PasswordChange
                setSuccessfulChanged={setSuccessfulChanged}
                setUnsuccessfulChange={setUnsuccessfulChange}
              />
            </Stack>
          </TabPanel>
          <TabPanel value="1">
            <Box className="OrderHistory">
              <Stack direction="row" justifyContent="center" alignItems="flex-start" spacing={2}>
                <Stack bgcolor="white" padding={1} divider={<Divider flexItem />}>
                  <Typography variant="h4">Your recent orders:</Typography>
                  {orders?.map((order) => {
                    return (
                      <Stack
                        spacing={2}
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        bgcolor="white"
                        padding={2}
                      >
                        <OrderHistory order={order}></OrderHistory>
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            </Box>
          </TabPanel>
          <TabPanel value="2">
            <PremiumTab />
          </TabPanel>
        </TabContext>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={successfulChanged}
        autoHideDuration={1500}
        onClose={() => {
          {
            setSuccessfulChanged(false);
          }
        }}
      >
        <Alert
          onClose={() => setSuccessfulChanged(false)}
          severity="success"
          sx={{ width: "100%" }}
          icon={<CheckCircleOutlineIcon fontSize={"large"} />}
        >
          <Typography variant="h5">Your change request has been completed.</Typography>
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={unsuccessfulChange}
        autoHideDuration={1500}
        onClose={() => {
          {
            setUnsuccessfulChange(false);
          }
        }}
      >
        <Alert
          onClose={() => setUnsuccessfulChange(false)}
          severity="error"
          sx={{ width: "100%" }}
          icon={<ErrorOutlineOutlinedIcon fontSize={"large"} />}
        >
          <Typography variant="h5">The change process has been aborted!</Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Profile;
