import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Card,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const q1 = "How does Airparts work?";
const a1 =
  "With AirParts, you don't have to buy the latest computer hardware for thousands of euros. We enable you to rent the products you desire for a monthly fee. After the duration is over, you send the components back to us. This allows you to update your hardware regularly, always using the latest generation of CPUs, GPUs and more. Simply browse our shop and find you next favorite component.";

const q2 = "Which payment options do I have?";
const a2 =
  "Currently, we use Stripe as our payment service partner. However, we are planning to offer more payment options in the future.";

const q3 = "How long can I rent components?";
const a3 =
  "AirParts offers you a lot of options: You can rent a component for one, two, three, six, twelve or 18 months. You can choose the duration for each item you want to order separately, i.e. your order can contain, for example, a GPU with a duration of three months and a mainboard with a duration of 18 months. You can also rent several units of the same component with different durations.";

const q4 = "What is the minimum order value?";
const a4 =
  "There is no minimum order value. We want to make you happy regardless of how big your order is!";

const q5 = "What exactly is the one time deposit that appears during the checkout process?";
const a5 =
  "This is a deposit that you have to pay when you place your order, but you will get it back at the end of the renting duration. The deposit is equal to one monthly rate of the respective component.";

const q6 = "How long does the delivery of my order take?";
const a6 = "The delivery time is usually 2-3 working days.";

const questions = [q1, q2, q3, q4, q5, q6];
const answers = [a1, a2, a3, a4, a5, a6];

const Faq = () => {
  return (
    <Box flex={6} padding={5}>
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">FAQ</Typography>
        </Breadcrumbs>
      </Box>
      <Card>
        <Typography paddingTop={5} variant="h3" align="center" sx={{ color: "#3D80E1" }}>
          Frequently Asked Questions
        </Typography>

        <Typography paddingLeft={5} paddingRight={5} variant="h5" align="justify" lineHeight={1.5}>
          {
            "Here, you can find answers to questions you may have when you are new to our service. If you have any questions that are not covered on this page, please feel free to use our "
          }
          <RouterLink to={"../contact"} style={{ color: "black" }}>
            {"contact formular."}
          </RouterLink>
        </Typography>

        <Divider sx={{ paddingTop: 2 }} />
        {questions.map((question, index) => {
          return (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{question}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography>{answers[index]}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Is express delivery also an option?</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography>
              {
                "If you want to take advantage of express delivery, consider our premium membership. You can find more information "
              }
              <RouterLink to={"../subscription"} style={{ color: "black" }}>
                {"here."}
              </RouterLink>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              AirParts is such a cool company! How can I get involved?
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography>
              {
                "If you are interested in joining us on our mission to make high quality hardware affordable, feel free to "
              }
              <Link href="mailto:airparts-hr@outlook.com" color="inherit">
                {"send us your application via email!"}
              </Link>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Card>
    </Box>
  );
};

export default Faq;
