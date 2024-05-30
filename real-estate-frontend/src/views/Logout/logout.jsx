import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Container,
  Snackbar,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useHistory } from "react-router-dom";
import AuthContext from "../../context/AuthContext"; // Import your AuthContext

const styles = {
  snackbar: {
    color: "white",
  },
};

const useStyles = makeStyles(styles);

const Logout = (props) => {
  const { logout } = useContext(AuthContext);
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      localStorage.setItem("token", null);
      setisLoggedIn(false);
      setSnackbarSeverity("success");
      setSnackbarColor("#03811a");
      setSnackbarMessage("Logged Out");
      setOpenSnackbar(true);
      localStorage.setItem("lgn", "");
      logout();
      setTimeout(() => history.push(`/login`), 3000);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarColor("#c21111");
      setSnackbarMessage(error);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div
        style={{
          marginTop: "64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Are you sure, you want to log out?</Typography>
        <form
          style={{ width: "100%", marginTop: "24px" }}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}></Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "24px" }}
          >
            Yes
          </Button>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
            className={classes.snackbar}
            style={{ backgroundColor: snackbarColor }}
            elevation={6}
            variant="filled"
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    </Container>
  );
};

export default Logout;
