import {
  Alert,
  Breadcrumbs,
  Button,
  Card,
  Divider,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Axios from "axios";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const handleSubmit = () => {
    Axios.post("http://localhost:8080/contact/", {
      name: name,
      email: email,
      subject: subject,
      text: text,
    }).then((result, err) => {
      if (err) {
        console.log(err);
      } else {
        setOpenSnackBar(true);
        setName("");
        setEmail("");
        setSubject("");
        setText("");
      }
    });
  };
  return (
    <Box flex={6} padding={5}>
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">Contact</Typography>
        </Breadcrumbs>
      </Box>
      <Card>
        <Typography paddingTop={5} variant="h3" align="center" sx={{ color: "#3D80E1" }}>
          Contact
        </Typography>

        <Typography
          paddingLeft={5}
          paddingRight={5}
          paddingBottom={5}
          variant="h5"
          align="justify"
          lineHeight={1.5}
        >
          {
            "If you have any specific questions, you can get in touch with us directly on this page. Just enter your name, email address and your request in the form below and hit the submit button. A service agent will then contact you within 3 working days. Please note that we also have a "
          }
          <RouterLink to={"../faq"} style={{ color: "black" }}>
            {"FAQ page"}
          </RouterLink>
          . Please check first if your question is already answered there.
        </Typography>

        <Divider></Divider>

        <Stack spacing={4} padding={5}>
          <TextField
            required
            id="name"
            label="Your Name"
            variant="outlined"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <TextField
            required
            id="email"
            label="Your Email Address"
            variant="outlined"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <TextField
            required
            id="subject"
            label="Subject"
            variant="outlined"
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
            }}
          />
          <TextField
            required
            id="message"
            label="Your Message"
            multiline
            rows={8}
            variant="outlined"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
          />
          <Button variant="contained" sx={{ width: 350 }} onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </Card>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackBar}
        autoHideDuration={2500}
        onClose={() => {
          setOpenSnackBar(false);
        }}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          severity="success"
          sx={{ width: "100%" }}
          icon={<CheckCircleOutlineIcon fontSize={"large"} />}
        >
          <Typography variant="h5">
            Thank you for your message! We will reach out to you as soon as possible.
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
