import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Container,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { config } from "../../config/config";
import AuthContext from "../../context/AuthContext"; // Import your AuthContext

const { backendURL } = config;

const LoginPage = (props) => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const { login } = useContext(AuthContext);
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      // You can handle login logic here
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Content-Type"] = "application/json";
      // axios.defaults.headers.common["Authorization"] = `${token}`;

      const loginData = {
        email,
        password,
      };
      const response = await axios.post(`/login`, loginData);
      if (response && response.data && response.data.data) {
        const { data } = response.data || {};
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data._id);
        setisLoggedIn(true);
        setSnackbarSeverity("success");
        setSnackbarMessage("Login successful");
        setOpenSnackbar(true);
        localStorage.setItem("lgn", "true");
        login();
        setTimeout(() => history.push(`/`), 2000);
      }
    } catch (error) {
      console.log({ error });
      setSnackbarSeverity("error");
      setSnackbarMessage(error.response.data.message);
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
        <Typography variant="h4">Agent Login</Typography>
        <form
          style={{ width: "100%", marginTop: "24px" }}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="email"
                fullWidth
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "24px" }}
          >
            Login
          </Button>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
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

export default LoginPage;
