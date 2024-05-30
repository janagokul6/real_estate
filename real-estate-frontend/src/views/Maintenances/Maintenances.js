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
import PostAddIcon from "@mui/icons-material/PostAdd";
import Tooltip from "@material-ui/core/Tooltip";
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

export default function Maintenances() {
  const classes = useStyles();
  const history = useHistory();

  const [maintenanceList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState({});

  const [isAdmin, setIsAdmin] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");

  const handleCloseSnackBar = () => {
    setSnackbarOpen(false);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Authorization"] = `${token}`;
      const response = await axios.get("/maintenance/");

      const { data } = response;
      const { maintenances } = data.data || {};
      const maintenanceList = maintenances.map((maintenance, index) => {
        const {
          _id,
          property,
          agent,
          description,
          assignedTo,
          priority,
          status,
          images,
          createdAt,
        } = maintenance;
        const formattedDate = createdAt
          ? moment(createdAt).format("DD MMMM, YYYY")
          : ".............";
        const ViewButton = (
          <Tooltip title="View">
            <VisibilityIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleViewButtonClick(maintenance)}
            />
          </Tooltip>
        );

        const DeleteButton = (
          <Tooltip title="Delete">
            <DeleteIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleDeleteButtonClick(maintenance)}
            />
          </Tooltip>
        );
        const maintenanceArray = [];
        maintenanceArray[0] = index + 1;
        maintenanceArray[1] = <div className={classes.textWrap}>{_id}</div>;
        maintenanceArray[2] = (
          <div className={classes.textLongWrap}>{description}</div>
        );
        maintenanceArray[3] = property.title;
        maintenanceArray[4] = agent.name;
        maintenanceArray[5] = assignedTo.name;
        maintenanceArray[6] = priority;
        maintenanceArray[7] = status;

        maintenanceArray[8] = formattedDate;
        maintenanceArray[9] = ViewButton;
        maintenanceArray[10] = DeleteButton;
        return maintenanceArray;
      });
      setUserList(maintenanceList);
    } catch (error) {
      console.log("Error While fetching Maintenances : ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewButtonClick = (data) => {
    const { _id } = data;
    history.push(`/maintenance/${_id}`);
  };

  const handleAddButtonClick = () => {
    history.push(`/maintenance/`);
  };

  const handleDeleteButtonClick = async (data) => {
    try {
      const { _id } = data;
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.defaults.headers.common["Authorization"] = `${token}`;

      const response = await axios.delete(`/maintenance/${_id}`);
      if (response && response.data && response.data.data) {
        setSnackbarSeverity("warning");
        setSnackbarColor("#757a02");
        setSnackbarMessage("Maintenance Deleted!");
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
            <h4 className={classes.cardTitleWhite}>Maintenances List</h4>
            <Tooltip title="Add Maintenance">
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
                "Description",
                "Property",
                "Agent",
                "Assigned To  ",
                "Priority",
                "Status",
                "Created At",
                "View",
                "Delete",
              ]}
              tableData={[...maintenanceList]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
