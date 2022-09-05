import CloseIcon from "@mui/icons-material/Close";
import { Drawer, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import * as React from "react";
import { Link } from "react-router-dom";
//const drawerWidth = 200;

export default function ClippedDrawer({ open, setOpen }) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: { width: 300 },
      }}
    >
      <List>
        <ListItem style={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton aria-label="delete" size="large" onClick={() => setOpen(false)}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </ListItem>
        {[
          { title: "PC Configurator", url: "/configurator" },
          { title: "Processors", url: "/shop/cpu" },
          { title: "Graphics Cards", url: "/shop/gpu" },
          { title: "Mainboards", url: "/shop/mainboard" },
          { title: "Cases", url: "/shop/case" },
          { title: "Memory", url: "/shop/ram" },
          { title: "Drives", url: "/shop/drive" },
          { title: "Second-Hand", url: "/shop/secondHand" },
        ].map((elem) => (
          <ListItem key={elem.title} disablePadding>
            <ListItemButton component={Link} to={elem.url} onClick={() => setOpen(false)}>
              {/* <ListItemIcon>
                <MemoryIcon />
              </ListItemIcon> */}
              <ListItemText primary={elem.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
    // </Box>
  );
}
