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

export default function Documents() {
  const classes = useStyles();
  const history = useHistory();
  const [documentList, setUserList] = useState([]);
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
      const response = await axios.get("/document/");

      const { data } = response;
      const { documents } = data.data || {};
      const documentList = documents.map((document, index) => {
        const {
          _id,
          title,
          file,
          tenant,
          category,
          accessPermissions,
          createdAt,
        } = document;
        const formattedDate = createdAt
          ? moment(createdAt).format("DD MMMM, YYYY")
          : ".............";

        const ViewButton = (
          <Tooltip title="View">
            <VisibilityIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleViewButtonClick(document)}
            />
          </Tooltip>
        );

        const DeleteButton = (
          <Tooltip title="Delete">
            <DeleteIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleDeleteButtonClick(document)}
            />
          </Tooltip>
        );
        const documentArray = [];
        documentArray[0] = index + 1;
        documentArray[1] = <div className={classes.textWrap}>{_id}</div>;
        documentArray[2] = title;
        documentArray[3] = tenant.name;
        documentArray[4] = category;
        documentArray[5] =
          file && Object.values(file).length > 0 ? "Yes" : "No";
        documentArray[6] = formattedDate;
        documentArray[7] = ViewButton;
        documentArray[8] = DeleteButton;
        return documentArray;
      });
      setUserList(documentList);
    } catch (error) {
      console.log("Error While fetching Documents : ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewButtonClick = (data) => {
    const { _id } = data;
    history.push(`/document/${_id}`);
  };

  const handleAddButtonClick = () => {
    history.push(`/document/`);
  };

  const handleDeleteButtonClick = async (data) => {
    try {
      const { _id } = data;
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.defaults.headers.common["Authorization"] = `${token}`;

      const response = await axios.delete(`/document/${_id}`);
      if (response && response.data && response.data.data) {
        setSnackbarSeverity("warning");
        setSnackbarColor("#757a02");
        setSnackbarMessage("Document Deleted!");
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

  const convertToHyphenSeparated = (str) => {
    return str.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());
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
            <h4 className={classes.cardTitleWhite}>Documents List</h4>
            <Tooltip title="Add Document">
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
                "Tenant",
                "Category",
                "File",
                "Created At",
                "View",
                "Delete",
              ]}
              tableData={[...documentList]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
