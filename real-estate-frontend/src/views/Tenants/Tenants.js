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
import PostAddIcon from '@mui/icons-material/PostAdd';
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardFooter from "components/Card/CardFooter.js";
import Switch from "@material-ui/core/Switch";
import FormControl from "@material-ui/core/FormControl";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { config } from "../../config/config";
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
  addTenantBtn: { cursor: "pointer" },
  snackbar: {
    color: "white",
  },
  textWrap: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "100px",
  },
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const useStyles = makeStyles(styles);

export default function Tenants() {
  const classes = useStyles();
  const history = useHistory();

  const [tenantList, setTenantList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [tenantData, setTenantData] = useState({});
  const [checked, setChecked] = useState(false);

  const [isDisabled, setIsDisabled] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");

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
  const handleChangeStatus = (event) => {
    const status = event.target.checked === true ? "active" : "in-active";
    setTenantData((prevState) => ({
      ...prevState,
      status,
    }));
  };

  const handleChange = (event, key) => {
    const value = event.target.value;

    setTenantData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Authorization"] = `${token}`;
      const response = await axios.get("/tenant/");

      const { data } = response;
      const { tenants } = data.data || {};
      const tenantList = tenants.map((tenant, index) => {
        const {
          _id,
          name,
          email,
          phone,
          createdAt,
          rentStatus,
          agreement,
        } = tenant;

        const formattedDate = moment(createdAt).format("DD MMMM, YYYY");
        const ViewButton = (
          <Tooltip title="View">
            <VisibilityIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleViewButtonClick(tenant)}
            />
          </Tooltip>
        );

        const DeleteButton = (
          <Tooltip title="Delete">
            <DeleteIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleDeleteButtonClick(tenant)}
            />
          </Tooltip>
        );
        const tenantArray = [];
        tenantArray[0] = index + 1;
        tenantArray[1] = <div className={classes.textWrap}>{_id}</div>;
        tenantArray[2] = name;
        tenantArray[3] = email;
        tenantArray[4] = phone;
        tenantArray[5] = rentStatus;
        tenantArray[6] = agreement ? "done" : "pending";
        tenantArray[7] = formattedDate;
        tenantArray[8] = ViewButton;
        tenantArray[9] = DeleteButton;
        return tenantArray;
      });
      setTenantList(tenantList);
    } catch (error) {
      console.log("Error While fetching Tenants : ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewButtonClick = (data) => {
    const { _id } = data;
    history.push(`/tenant/${_id}`);
  };

  const handleDeleteButtonClick = async (data) => {
    try {
      const { _id } = data;
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.defaults.headers.common["Authorization"] = `${token}`;

      const response = await axios.delete(`/tenant/${_id}`);
      if (response && response.data && response.data.data) {
        setSnackbarSeverity("warning");
        setSnackbarColor("#757a02");
        setSnackbarMessage("Tenant Deleted!");
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

      const response = await axios.post(`/tenant/`, tenantData);
      if (response && response.data && response.data.data) {
        setSnackbarSeverity("success");
        setSnackbarColor("#03811a");
        setSnackbarMessage("Tenant data Added successfully!");
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
            <h4 className={classes.cardTitleWhite}>Tenants List</h4>
            <Tooltip title="Add Tenant">
              <PostAddIcon
                className={classes.addTenantBtn}
                onClick={handleOpen}
              ></PostAddIcon>
            </Tooltip>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={[
                "Number",
                "ID",
                "Name",
                "Email",
                "Phone",
                "Rent",
                "Agreement",
                "Created At",
                "View",
                "Delete",
              ]}
              tableData={[...tenantList]}
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
              minWidth: 300,
              maxWidth: 600,
            }}
          >
            <div>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <Card>
                    <CardHeader color="primary">
                      <h4 className={classes.cardTitleWhite}>Add Tenant</h4>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Name"
                            id="name"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: tenantData.name,
                              handleChange,
                            }}
                          />
                        </GridItem>

                        <GridItem xs={12} sm={12} md={4}>
                          <CustomInput
                            labelText="Email"
                            id="email"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: tenantData.email,
                              type: "email",
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
                            }}
                            inputProps={{
                              value: tenantData.phone,
                              handleChange,
                            }}
                          />
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
