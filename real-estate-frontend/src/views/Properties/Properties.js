import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import axios from "axios";
import moment from "moment";
import Button from "components/CustomButtons/Button.js";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardFooter from "components/Card/CardFooter.js";
import Switch from "@material-ui/core/Switch";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { config } from "../../config/config";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { CurrencyBitcoin } from "@mui/icons-material";

const { backendURL } = config;

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  cardHeader: {
    display: "flex !important",
    justifyContent: "space-between !important",
    alignItems: "center !important",
  },
  addUserBtn: { cursor: "pointer" },
  snackbar: {
    color: "white",
  },
  textWrap: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "100px",
  },
  textLongWrap: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "150px",
  },
  status: {
    marginTop: "45px",
    textAlign: "center",
    fontSize: "smaller",
    color: "#909090bf",
    fontWeight: 400,
  },
  smallerFont: {
    fontSize: "smaller",
    color: "#00000061",
    marginTop: "48px",
  },
};

const useStyles = makeStyles(styles);

export default function Properties() {
  const classes = useStyles();
  const history = useHistory();

  const [propertyList, setUserList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [propertyData, setPropertyData] = useState({});

  const [isAdmin, setIsAdmin] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");
  const [tenantsList, setTenantsList] = useState([]);
  const [propertiesList, setPropertiesList] = useState([]);
  const [currentProperty, setCurrentProperty] = useState({});
  const [currentTenant, setCurrentTenant] = useState({});

  const handleCloseSnackBar = () => {
    setSnackbarOpen(false);
  };

  const fetchUserId = () => {
    const pathtitle = window.location.pathtitle;
    const pattern = /\/property\/(.*)/;
    const match = pathtitle.match(pattern);
    const isAdmin = match ? decodeURIComponent(match[1]) : "";

    setIsAdmin(isAdmin);
    return isAdmin;
  };
  const handleCurrentData = (event, key) => {
    const value = event.target.value;
    if (key === "property") setCurrentProperty(value);
    if (key === "tenant") setCurrentTenant(value);
    event.target.value = value._id;
    handleChange(event, key);
  };

  const handleChange = (event, key) => {
    let value = event.target.value;
    if (key) {
      if (key === "isPaid") value = event.target.checked;
    }
    setPropertyData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleOpen = () => {
    setOpen(true);
    setPropertyData({});
    setCurrentProperty({});
    setCurrentTenant({});
  };
  const handleClose = () => {
    setOpen(false);
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Authorization"] = `${token}`;
      const response = await axios.get("/property/");

      const { data } = response;
      const { properties } = data.data || {};
      const propertyList = properties.map((property, index) => {
        const {
          _id,
          title,
          desc,
          city,
          state,
          status,
          images,
          createdAt,
        } = property;
        const formattedDate = createdAt
          ? moment(createdAt).format("DD MMMM, YYYY")
          : ".............";
        const ViewButton = (
          <Tooltip title="View">
            <VisibilityIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleViewButtonClick(property)}
            />
          </Tooltip>
        );

        const DeleteButton = (
          <Tooltip title="Delete">
            <DeleteIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleDeleteButtonClick(property)}
            />
          </Tooltip>
        );
        const propertyArray = [];
        propertyArray[0] = index + 1;
        propertyArray[1] = <div className={classes.textWrap}>{_id}</div>;
        propertyArray[2] = title;
        propertyArray[3] = <div className={classes.textLongWrap}>{desc}</div>;
        propertyArray[4] = `${city}, ${state}`;
        propertyArray[5] = status;
        propertyArray[6] = images.length;
        propertyArray[7] = formattedDate;
        propertyArray[8] = ViewButton;
        propertyArray[9] = DeleteButton;
        return propertyArray;
      });
      setUserList(propertyList);
    } catch (error) {
      console.log("Error While fetching Properties : ", error);
    }
  };

  const fetchPropertiesAndTenants = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Authorization"] = `${token}`;
      const propResponse = await axios.get("/property/");
      const tenantResponse = await axios.get("/tenant/");

      const { data: propData } = propResponse;
      const { properties } = propData.data || [];

      const { data: tenantData } = tenantResponse;
      const { tenants } = tenantData.data || [];

      const propertiesList = properties.map((prop) => {
        const { title, _id } = prop;
        return { title, _id };
      });

      const tenantsList = tenants.map((prop) => {
        const { name, _id } = prop;
        return { name, _id };
      });

      setTenantsList(tenantsList);
      setPropertiesList(propertiesList);
    } catch (error) {
      console.log("Error While fetching Properties : ", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPropertiesAndTenants();
  }, []);

  const handleViewButtonClick = (data) => {
    const { _id } = data;
    history.push(`/property/${_id}`);
  };

  const handleAddButtonClick = () => {
    history.push(`/property/`);
  };

  const handleDeleteButtonClick = async (data) => {
    try {
      const { _id } = data;
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.defaults.headers.common["Authorization"] = `${token}`;

      const response = await axios.delete(`/property/${_id}`);
      if (response && response.data && response.data.data) {
        setSnackbarSeverity("warning");
        setSnackbarColor("#757a02");
        setSnackbarMessage("Property Deleted!");
        setSnackbarOpen(true);
        fetchData();
      }
    } catch (error) {
      console.log({ error });
      setSnackbarColor("#c21111");
      setSnackbarSeverity("error");
      setSnackbarMessage(error.response.data.message);
      setSnackbarOpen(true);
    }
  };

  const handleSaveData = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.defaults.headers.common["Authorization"] = `${token}`;

      const response = await axios.post(`/property/`, propertyData);
      if (response && response.data && response.data.data) {
        setSnackbarSeverity("success");
        setSnackbarColor("#03811a");
        setSnackbarMessage("Rent Added successfully!");
        setSnackbarOpen(true);
        setTimeout(() => setOpen(false), 2000);
        fetchData();
      }
    } catch (error) {
      console.log({ error });
      setSnackbarColor("#c21111");
      setSnackbarSeverity("error");
      setSnackbarMessage(error.response.data.message);
      setSnackbarOpen(true);
    }
  };

  const propertiesMenuItem = propertiesList.map((option) => (
    <MenuItem key={option._id} value={option}>
      {option.title}
    </MenuItem>
  ));
  const tenantsMenuItem = tenantsList.map((option) => (
    <MenuItem key={option._id} value={option}>
      {option.name}
    </MenuItem>
  ));

  return (
    <GridContainer>
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
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary" className={classes.cardHeader}>
            <h4 className={classes.cardTitleWhite}>Properties List</h4>
            <Tooltip title="Add Property">
              <PostAddIcon
                className={classes.addUserBtn}
                onClick={handleAddButtonClick}
              ></PostAddIcon>
            </Tooltip>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={[
                "Number",
                "ID",
                "Title",
                "Description",
                "Address",
                "Status",
                "Images",
                "Created At",
                "View",
                "Delete",
              ]}
              tableData={[...propertyList]}
            />
          </CardBody>
        </Card>
      </GridItem>

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              width: 650,
            }}
          >
            <div>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <Card>
                    <CardHeader color="primary">
                      <h4 className={classes.cardTitleWhite}>Add Rent</h4>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                        <GridItem xs={12} sm={4} md={4}>
                          <div>
                            <InputLabel
                              className={classes.smallerFont}
                              id="select-label"
                            >
                              Properties
                            </InputLabel>
                            <Select
                              className={classes.smallFont}
                              labelId="property"
                              value={currentProperty.title}
                              onChange={(e) => handleCurrentData(e, "property")}
                              fullWidth={true}
                            >
                              {propertiesMenuItem}
                            </Select>
                          </div>
                        </GridItem>
                        <GridItem xs={12} sm={4} md={4}>
                          <div>
                            <InputLabel
                              className={classes.smallerFont}
                              id="select-label"
                            >
                              Tenants
                            </InputLabel>
                            <Select
                              className={classes.smallFont}
                              labelId="property"
                              value={currentTenant.name}
                              onChange={(e) => handleCurrentData(e, "tenant")}
                              fullWidth={true}
                            >
                              {tenantsMenuItem}
                            </Select>
                          </div>
                        </GridItem>

                        <GridItem xs={12} sm={4} md={4}>
                          <div>
                            <InputLabel
                              className={classes.smallerFont}
                              id="select-label"
                            >
                              Category
                            </InputLabel>
                            <Select
                              className={classes.smallFont}
                              labelId="category"
                              value={
                                propertyData.category
                                  ? propertyData.category
                                  : ""
                              }
                              onChange={(e) => handleChange(e, "category")}
                              fullWidth={true}
                            >
                              <MenuItem value="monthly">monthly</MenuItem>
                              <MenuItem value="quarterly">quarterly</MenuItem>
                              <MenuItem value="half-yearly">
                                half yearly
                              </MenuItem>
                              <MenuItem value="yearly">yearly</MenuItem>
                            </Select>
                          </div>
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={12} sm={6} md={6}>
                          <CustomInput
                            labelText="Amount"
                            id="amount"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: propertyData.amount,
                              handleChange,
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={2}>
                          <div className={classes.status}>
                            Paid
                            <Switch
                              checked={
                                propertyData && propertyData.isPaid === true
                                  ? true
                                  : false
                              }
                              onChange={(e) => handleChange(e, "isPaid")}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </div>
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                    {isAdmin ? (
                      <CardFooter>
                        <Button onClick={handleSaveData} color="primary">
                          Save
                        </Button>
                      </CardFooter>
                    ) : (
                      <></>
                    )}
                  </Card>
                </GridItem>
              </GridContainer>
            </div>
          </Box>
        </Modal>
      </div>
    </GridContainer>
  );
}
