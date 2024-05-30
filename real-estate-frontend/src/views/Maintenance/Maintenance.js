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
import { useHistory } from "react-router-dom";
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
  imagesContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e9e9e9",
    borderRadius: "20px",
    margin: "50px 0 0 0",
  },
  imagesSubContainer: {
    display: "grid",
    textAlign: "center",
    border: "1px solid #cccccc",
    borderRadius: "5px",
    margin: "10px",
    boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
  },
  noImageFound: {
    fontSize: "medium",
    color: "#7a7a7a",
    boxShadow: " 2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
    padding: "10px",
    margin: "20px",
    border: "1px solid #ececec",
  },
  addImageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "30px 0 0 30px",
  },
  addImage: {
    fontSize: "smaller",
    border: "1px solid #b795bc",
    padding: "10px",
    boxShadow: "3px 3px 3px 1px #e4bfed",
    borderRadius: "10px",
    color: "white",
    background: "#a849c0",
    cursor: "pointer",
  },
  modalAddImage: {
    display: "inline-grid",
    textAlign: "center",
    border: "1px solid grey",
    padding: "35px",
  },
  inputFile: { marginBottom: "10px", color: "white", background: "#888888" },
  imageUploadBtn: {
    color: "white",
    background: "#a311a3",
    width: "50%",
    margin: "auto",
    padding: "5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  "@keyframes blinker": {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  blink: {
    animationName: "$blinker",
    animationDuration: "1.5s",
    animationTimingFunction: "ease-in",
    animationIterationCount: "2",
  },
};

const useStyles = makeStyles(styles);

export default function Maintenance(props) {
  const classes = useStyles();
  const history = useHistory();
  const [maintenanceData, setMaintenanceData] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");
  const [propertiesList, setPropertiesList] = useState([]);
  const [currentProperty, setCurrentProperty] = useState("");
  const [contractorsList, setContractorsList] = useState([]);
  const [currentContractor, setCurrentContractor] = useState({});

  const handleCloseSnackBar = () => {
    setSnackbarOpen(false);
  };

  const handleCurrentData = (event, key) => {
    const value = event.target.value;
    if (key === "property") setCurrentProperty(value);
    if (key === "assignedTo") setCurrentContractor(value);
    setMaintenanceData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const fetchMaintenanceId = () => {
    const pathname = window.location.pathname;
    const pattern = /\/maintenance\/(.*)/;
    const match = pathname.match(pattern);
    const isExistingVal = match ? decodeURIComponent(match[1]) : null;
    const isExisting = isExistingVal ? true : false;
    setIsExisting(isExisting);
    return isExistingVal;
  };

  const handleChange = (event, key, data, action) => {
    const value = event.target.value;
    setMaintenanceData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const fetchData = async (existingMaintenance) => {
    const token = localStorage.getItem("token");
    axios.defaults.baseURL = backendURL;
    axios.defaults.headers.common["Authorization"] = `${token}`;
    const response = await axios.get(`/maintenance/${existingMaintenance}`);
    const { data: dataVal } = response;
    const { maintenance } = dataVal.data || {};

    const {
      _id,
      property,
      agent,
      description,
      assignedTo,
      priority,
      status,
    } = maintenance;

    const data = {
      _id,
      property,
      agent,
      description,
      assignedTo,
      priority,
      status,
    };
    setCurrentProperty(property._id);
    setCurrentContractor(assignedTo._id);
    setMaintenanceData(data);
  };

  const fetchPropertiesAndContractors = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Authorization"] = `${token}`;
      const propResponse = await axios.get("/property/");
      const contractorResponse = await axios.get("/user/?type=2");

      const { data: propData } = propResponse;
      const { properties } = propData.data || [];

      const { data: contractorData } = contractorResponse;
      const { users: contractors } = contractorData.data || [];

      const propertiesList = properties.map((prop) => {
        const { title, _id } = prop;
        return { title, _id };
      });

      const contractorsList = contractors.map((prop) => {
        const { name, _id } = prop;
        return { name, _id };
      });
      setContractorsList(contractorsList);
      setPropertiesList(propertiesList);
    } catch (error) {
      console.log("Error While fetching Maintenance : ", error);
    }
  };

  useEffect(() => {
    const existingMaintenance = fetchMaintenanceId();
    if (!existingMaintenance) {
      setIsDisabled(false);
    } else {
      fetchData(existingMaintenance);
    }
    fetchPropertiesAndContractors();
  }, []);

  const handleSave = () => {
    if (isExisting) {
      handleUpdateData();
    } else {
      handleSaveData();
    }
  };

  const handleUpdateData = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.defaults.headers.common["Authorization"] = `${token}`;
      const maintenanceId = maintenanceData._id;
      const response = await axios.patch(
        `/maintenance/${maintenanceId}`,
        maintenanceData
      );
      if (response && response.data && response.data.data) {
        setIsDisabled(true);
        setSnackbarSeverity("success");
        setSnackbarColor("#03811a");
        setSnackbarMessage("Maintenance data Updated successfully!");
        setSnackbarOpen(true);
        setTimeout(() => history.push(`/maintenances`), 3000);
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

      const response = await axios.post(`/maintenance/`, maintenanceData);

      if (response && response.data && response.data.data) {
        setSnackbarSeverity("success");
        setSnackbarColor("#03811a");
        setSnackbarMessage("Maintenance Added successfully!");
        setSnackbarOpen(true);
        setTimeout(() => history.push(`/maintenances`), 3000);
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

  const propertiesMenuItem = propertiesList.map((option) => (
    <MenuItem key={option._id} value={option._id}>
      {option.title}
    </MenuItem>
  ));

  const contractorsMenuItem = contractorsList.map((option) => (
    <MenuItem key={option._id} value={option._id}>
      {option.name}
    </MenuItem>
  ));

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
                <b>
                  {isExisting ? "Update" : "Add"}
                  &nbsp;
                  {"Maintenance Details"}
                </b>
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Description"
                    id="description"
                    formControlProps={{
                      fullWidth: true,
                      disabled: isDisabled,
                    }}
                    inputProps={{
                      value: maintenanceData?.description,
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
                      Properties
                    </InputLabel>
                    <Select
                      className={classes.smallFont}
                      labelId="property"
                      disabled={isExisting}
                      value={currentProperty}
                      onChange={(e) => handleCurrentData(e, "property")}
                      fullWidth={true}
                    >
                      {propertiesMenuItem}
                    </Select>
                  </div>
                </GridItem>

                <GridItem xs={12} sm={12} md={2}>
                  <div>
                    <InputLabel
                      className={classes.smallerFont}
                      id="select-label"
                    >
                      Assigned To
                    </InputLabel>
                    <Select
                      className={classes.smallFont}
                      labelId="assignedTo"
                      disabled={isDisabled}
                      value={currentContractor}
                      onChange={(e) => handleCurrentData(e, "assignedTo")}
                      fullWidth={true}
                    >
                      {contractorsMenuItem}
                    </Select>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                  <div>
                    <InputLabel
                      className={classes.smallerFont}
                      id="select-label"
                    >
                      Priority
                    </InputLabel>
                    <Select
                      disabled={isDisabled}
                      className={classes.smallFont}
                      labelId="priority"
                      value={
                        maintenanceData.priority ? maintenanceData.priority : ""
                      }
                      onChange={(e) => handleChange(e, "priority")}
                      fullWidth={true}
                    >
                      <MenuItem value="high">high</MenuItem>
                      <MenuItem value="medium">medium</MenuItem>
                      <MenuItem value="low">low</MenuItem>
                    </Select>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                  <div>
                    <InputLabel
                      className={classes.smallerFont}
                      id="select-label"
                    >
                      Status
                    </InputLabel>
                    <Select
                      disabled={isDisabled}
                      className={classes.smallFont}
                      labelId="status"
                      value={
                        maintenanceData.status ? maintenanceData.status : ""
                      }
                      onChange={(e) => handleChange(e, "status")}
                      fullWidth={true}
                    >
                      <MenuItem value="pending">pending</MenuItem>
                      <MenuItem value="assigned">assigned</MenuItem>
                      <MenuItem value="in_progress">in-progress</MenuItem>
                      <MenuItem value="completed">completed</MenuItem>
                    </Select>
                  </div>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              {isDisabled ? (
                <Button onClick={handleEdit} color="primary">
                  Edit
                </Button>
              ) : (
                <Button onClick={handleSave} color="primary">
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
