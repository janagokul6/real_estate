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
import Switch from "@material-ui/core/Switch";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { config } from "../../config/config";
const { backendURL } = config;
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

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
    color: "#909090bf",
    display: "grid",
    marginTop: "45px",
    marginLeft: "45px",
  },
  snackbar: {
    color: "white",
  },
  smallerFont: {
    fontSize: "smaller",
    color: "#00000061",
    marginTop: "48px",
  },
};

const useStyles = makeStyles(styles);

export default function TenantProfile(props) {
  const classes = useStyles();
  const history = useHistory();

  const [tenantData, setTenantData] = useState({});
  const [checked, setChecked] = useState(false);

  const [isDisabled, setIsDisabled] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");
  const [selectRentStatus, setSelectRentStatus] = React.useState("");

  const handleRentStatus = (event) => {
    setSelectRentStatus(event.target.value);
  };
  const handleCloseSnackBar = () => {
    setSnackbarOpen(false);
  };

  const fetchTenantId = () => {
    const pathname = window.location.pathname;
    const pattern = /\/tenant\/(.*)/;
    const match = pathname.match(pattern);
    const isAdmin = match ? decodeURIComponent(match[1]) : "";
    setIsAdmin(isAdmin);
    return isAdmin;
  };

  const handleChange = (event, key) => {
    let value = event.target.value;
    if (key) {
      if (key === "agreement") value = event.target.checked;
    }

    setTenantData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    let tenantData = fetchTenantId();
    if (!tenantData) {
      tenantData = localStorage.getItem("id");
    }

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Authorization"] = `${token}`;
      const response = await axios.get(`/tenant/${tenantData}`);
      const { data: dataVal } = response;
      const { tenant } = dataVal.data || {};

      const { _id, name, email, phone, rentStatus, agreement } = tenant;
      const data = {
        _id,
        name,
        email,
        phone,
        rentStatus,
        agreement,
      };
      const checkedVal = data.status === "active" ? true : false;
      setChecked(checkedVal);
      setTenantData(data);
    };
    fetchData();
  }, []);

  const handleSaveData = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL; 
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.defaults.headers.common["Authorization"] = `${token}`;
      delete tenantData.email;

      const response = await axios.patch(
        `/tenant/${tenantData._id}`,
        tenantData
      );
      if (response && response.data && response.data.data) {
        setIsDisabled(true);
        setSnackbarSeverity("success");
        setSnackbarColor("#03811a");
        setSnackbarMessage("Tenant data Updated successfully!");
        setSnackbarOpen(true);
        setTimeout(() => history.push(`/tenants`), 3000);
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
              <h4 className={classes.cardTitleWhite}>{"Tenant Profile"}</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={2}>
                  <CustomInput
                    labelText="Name"
                    id="name"
                    formControlProps={{
                      fullWidth: true,
                      disabled: isDisabled,
                    }}
                    inputProps={{
                      value: tenantData.name,
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
                      value: tenantData.email,
                      handleChange,
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={2}>
                  <CustomInput
                    labelText="Phone"
                    id="phone"
                    formControlProps={{
                      fullWidth: true,
                      disabled: isDisabled,
                    }}
                    inputProps={{
                      value: tenantData.phone,
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
                      Rent Status
                    </InputLabel>
                    <Select
                      disabled={isDisabled}
                      className={classes.smallFont}
                      labelId="rentStatus"
                      value={tenantData.rentStatus ? tenantData.rentStatus : ""}
                      onChange={(e) => handleChange(e, "rentStatus")}
                      fullWidth={true}
                    >
                      <MenuItem value="due">due</MenuItem>
                      <MenuItem value="paid">paid</MenuItem>
                    </Select>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                  <div className={classes.status}>
                    Agreement
                    <Switch
                      checked={tenantData.agreement === true ? true : false}
                      onChange={(e) => handleChange(e, "agreement")}
                      inputProps={{ "aria-label": "controlled" }}
                      disabled={isDisabled}
                    />
                  </div>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}></GridItem>
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
