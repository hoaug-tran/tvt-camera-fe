import { AppBar, Toolbar, Typography } from "@mui/material";
import { darkPalette } from "@/themes/palette";
import { NavTabs } from "./NavTabs";
import { UserActions } from "./UserActions";

export const Navbar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: darkPalette.neutral[900] }}>
      <Toolbar
        disableGutters
        sx={{
          px: 2,
          minHeight: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          component="a"
          noWrap
          sx={{
            fontFamily: "Inter",
            fontWeight: 700,
            letterSpacing: ".2rem",
            color: "inherit",
            textDecoration: "none",
            fontSize: "1.1rem",
            minWidth: "fit-content",
          }}
        >
          QUẢN LÝ CAMERA TVT
        </Typography>

        <NavTabs />
        <UserActions />
      </Toolbar>
    </AppBar>
  );
};
