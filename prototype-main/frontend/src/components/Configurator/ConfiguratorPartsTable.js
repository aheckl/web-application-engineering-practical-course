import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import Axios from "axios";

const ConfiguratorPartsTable = ({ psu, setPsu }) => {
  const { configuration, setConfiguration, shoppingCart, setShoppingCart, configurationDuration } =
    useContext(AppContext);

  const [tableData, setTableData] = useState([
    { type: "cpu", buttontext: "CPU", buttonLink: "/shop/cpu" },
    { type: "gpu", buttontext: "GPU", buttonLink: "/shop/gpu" },
    { type: "mainboard", buttontext: "Mainboard", buttonLink: "/shop/mainboard" },
    { type: "case", buttontext: "Case", buttonLink: "/shop/case" },
    { type: "ram", buttontext: "Memory", buttonLink: "/shop/ram" },
    { type: "drive", buttontext: "Drive", buttonLink: "/shop/drive" },
  ]);
  const [compatable, setCompatable] = useState(true);
  const [incompatability, setIncompatabality] = useState({
    cpu: { incombinable: false, attribute: "" },
    drive: { incombinable: false, attribute: "" },
    gpu: { incombinable: false, attribute: "" },
    mainboard: { incombinable: false, attribute: "" },
    case: { incombinable: false, attribute: "" },
    ram: { incombinable: false, attribute: "" },
  });
  const [watts, setWatts] = useState(0);

  let navigate = useNavigate();

  useEffect(() => {
    recommendPsu(
      Object.values(configuration).reduce((akk, part) => {
        return (part?.watts ? part.watts : 0) + akk;
      }, 0)
    );
    setWatts(
      Object.values(configuration).reduce((akk, part) => {
        return (part?.watts ? part.watts : 0) + akk;
      }, 0)
    );
    compatabilityCheck();
  }, [configuration]);

  const recommendPsu = (watt) => {
    var query = { minWatts: watt + 100 };
    Axios.get("http://localhost:8080/part/psu", { params: query })
      .then((response) => {
        setPsu(response.data?.sort((a, b) => a.watts - b.watts)[0]);
      })
      .catch((error) => console.log(error));
  };

  const compatabilityCheck = () => {
    if (
      configuration.cpu &&
      configuration.mainboard &&
      configuration.cpu.cpuSocket != configuration.mainboard.cpuSocket
    ) {
      setIncompatabality({
        ...incompatability,
        cpu: { incombinable: true, attribute: "Socket: " + configuration.cpu.cpuSocket },
        mainboard: {
          incombinable: true,
          attribute: "Socket: " + configuration.mainboard.cpuSocket,
        },
      });
      setCompatable(false);
    }
  };
  const handleClick = (link) => {
    navigate(link, { state: { configuratorActive: true } });
  };

  const handleCellClick = (type) => {
    if (configuration[type]) {
      let state = { ...configuration[type], configuratorActive: true };
      navigate("/productDetails/" + configuration[type]._id, {
        state: state,
      });
    }
  };

  return (
    <Box flex={1} sx={{ width: "100%" }}>
      {!compatable ? (
        <Alert severity="warning" sx={{ padding: 1 }}>
          <AlertTitle>
            <strong>Your configuration is not compatible</strong>
          </AlertTitle>
          {Object.keys(incompatability).map((key) => {
            if (incompatability[key]?.incombinable) {
              return <Typography>{key + ": " + incompatability[key]?.attribute}</Typography>;
            }
          })}
        </Alert>
      ) : (
        ""
      )}
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h5">Component</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5">Price</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5">Choose</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => {
              return (
                <TableRow
                  hover
                  bgcolor={incompatability[row.type].incombinable ? "#FFF4E5" : "white"}
                  key={row.type}
                >
                  <TableCell align="center" onClick={() => handleCellClick(row.type)}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {configuration[row.type] ? (
                        <CheckCircleOutlineIcon
                          color={incompatability[row.type].incombinable ? "orange" : "primary"}
                          fontSize="large"
                        />
                      ) : (
                        <CircleOutlinedIcon fontSize="large" />
                      )}
                      <Stack>
                        <Typography variant="h5">{configuration[row.type]?.name}</Typography>
                        {configuration[row.type] ? (
                          <img
                            width={250}
                            src={require("/public/cards/all/" + configuration[row.type].cardImage)}
                          ></img>
                        ) : (
                          ""
                        )}
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    {configuration[row.type]?.prices[configurationDuration]} € / month
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant={configuration[row.type] ? "outlined" : "contained"}
                      onClick={() => handleClick(row.buttonLink)}
                      sx={{ width: 190 }}
                    >
                      {configuration[row.type] ? "Change " + row.buttontext : row.buttontext}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}

            <TableRow bgcolor={"#f6f6f6"}>
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CheckCircleOutlineIcon color="primary" fontSize="large" />
                  <Typography fontSize="large">{psu?.name}</Typography>
                </Stack>
              </TableCell>
              <TableCell align="center">{psu?.prices[configurationDuration]} € / month</TableCell>
              <TableCell align="center">
                <Typography variant="h6" sx={{ padding: 5 }}>
                  Our recommended PSU for a total peak power consumption of {watts} W{" "}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ConfiguratorPartsTable;
