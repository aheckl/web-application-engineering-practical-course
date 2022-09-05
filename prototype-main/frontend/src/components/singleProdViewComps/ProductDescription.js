import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import React from "react";
import PricingTable from "./PricingTable";
import TechnicalDataTable from "./TechnicalDataTable";

const ProductDescription = ({ product }) => {
  return (
    <div>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {!product?.description ? (
            <Typography>There is no description for this product yet.</Typography>
          ) : (
            product?.description.map((item) => {
              return (
                <div key={item}>
                  <Typography>{item}</Typography>
                  <br />
                </div>
              );
            })
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Technical Data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TechnicalDataTable product={product}></TechnicalDataTable>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Pricing Overview</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PricingTable prices={product?.prices}></PricingTable>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ProductDescription;
