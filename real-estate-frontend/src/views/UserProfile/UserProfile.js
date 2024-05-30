import React, { useEffect, useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import moment from "moment";
import { config } from "../../config/config";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
const { backendURL } = config;

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  status: {
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    marginTop: "45px",
    fontSize: "smaller",
    color: "#909090bf",
    fontWeight: 400,
  },
  snackbar: {
    color: "white",
  },
  smallerFont: {
    fontSize: "smaller",
    color: "#00000061",
    marginTop: "48px",
  },
  passwordContainer: {
    width: "50%",
    margin: "5px",
  },
};

const useStyles = makeStyles(styles);

export default function UserProfile(props) {
  const classes = useStyles();

  const [userData, setUserData] = useState({});

  const [isDisabled, setIsDisabled] = useState(true);
  const [isAgent, setIsAgent] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleCloseSnackBar = () => {
    setSnackbarOpen(false);
  };

  const fetchUserId = () => {
    const pathname = window.location.pathname;
    const pattern = /\/user\/(.*)/;
    const match = pathname.match(pattern);
    const isAgent = match ? decodeURIComponent(match[1]) : "";

    setIsAgent(isAgent);
    return isAgent;
  };
  const handleChangeStatus = (event) => {
    const status = event.target.checked === true ? "active" : "in-active";
    setUserData((prevState) => ({
      ...prevState,
      status,
    }));
  };

  const handleChange = (event, key) => {
    const value = event.target.value;

    setUserData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    let userData = fetchUserId();
    if (!userData) {
      userData = localStorage.getItem("id");
    }

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Authorization"] = `${token}`;
      const response = await axios.get(`/user/${null}`);
      const { data: dataVal } = response;
      const { user } = dataVal.data || {};
      const { _id, name, email, phone, role, createdAt } = user;
      const regDate = moment(createdAt).format("DD MMMM, YYYY");
      const data = {
        _id,
        name,
        email,
        phone,
        role,
        regDate,
      };
      setUserData(data);
    };
    fetchData();
  }, []);

  const handleSaveData = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.defaults.headers.common["Authorization"] = `${token}`;
      delete userData.email;
      const response = await axios.patch(`/user/${userData._id}`, userData);
      if (response && response.data && response.data.data) {
        setIsDisabled(true);
        setSnackbarSeverity("success");
        setSnackbarColor("#03811a");
        setSnackbarMessage("User data Updated successfully!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log({ error });
      setSnackbarColor("#c21111");
      setSnackbarSeverity("error");
      setSnackbarMessage(error.response.data.message);
      setSnackbarOpen(true);
    }
  };

  const handleEdit = () => {
    setIsDisabled(false);
  };

  const handleChangePassword = () => {
    setPasswordVisible(true);
  };
  return (
    <div>
      <div>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
            className={classes.snackbar}
            style={{ backgroundColor: snackbarColor }}
            elevation={6}
            variant="filled"
            onClose={handleCloseSnackBar}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                {isAgent ? "User Profile" : "Agent Profile"}
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Name"
                    id="name"
                    formControlProps={{
                      fullWidth: true,
                      disabled: isDisabled,
                    }}
                    inputProps={{
                      value: userData.name,
                      handleChange,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Email address"
                    id="email"
                    formControlProps={{
                      fullWidth: true,
                      disabled: true,
                    }}
                    inputProps={{
                      value: userData.email,
                      handleChange,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Phone "
                    id="phone"
                    formControlProps={{
                      fullWidth: true,
                      disabled: isDisabled,
                    }}
                    inputProps={{
                      value: userData.phone,
                      maxLength: 10,
                      handleChange,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                  <div>
                    <InputLabel
                      className={classes.smallerFont}
                      id="select-label"
                    >
                      Role
                    </InputLabel>
                    <Select
                      disabled={true}
                      className={classes.smallFont}
                      labelId="role"
                      value={userData.role ? userData.role : ""}
                      onChange={(e) => handleChange(e, "role")}
                      fullWidth={true}
                    >
                      <MenuItem value="agent">agent</MenuItem>
                      <MenuItem value="contractor">contractor</MenuItem>
                    </Select>
                  </div>
                </GridItem>
                <GridContainer className={classes.passwordContainer}>
                  {isPasswordVisible ? (
                    <>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText="Old Password "
                          id="oldPassword"
                          formControlProps={{
                            fullWidth: true,
                            disabled: isDisabled,
                          }}
                          inputProps={{
                            value: userData.oldPassword,
                            maxLength: 10,
                            type: "password",
                            handleChange,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText="New Password "
                          id="newPassword"
                          formControlProps={{
                            fullWidth: true,
                            disabled: isDisabled,
                          }}
                          inputProps={{
                            value: userData.password,
                            maxLength: 10,
                            type: "password",
                            handleChange,
                          }}
                        />
                      </GridItem>
                    </>
                  ) : (
                    <GridItem xs={12} sm={12} md={2}>
                      {isDisabled ? (
                        <></>
                      ) : (
                        <Button onClick={handleChangePassword} color="primary">
                          Change Password
                        </Button>
                      )}
                    </GridItem>
                  )}
                </GridContainer>
              </GridContainer>
            </CardBody>
            <CardFooter>
              {isDisabled ? (
                <Button onClick={handleEdit} color="primary">
                  Edit
                </Button>
              ) : (
                <Button onClick={handleSaveData} color="primary">
                  Save
                </Button>
              )}
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
