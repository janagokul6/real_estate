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
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import GetAppIcon from "@material-ui/icons/GetApp";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import filePlaceHolderImage from "../../assets/img/file.svg";
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
  filesContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e9e9e9",
    borderRadius: "20px",
    margin: "50px 0 0 0",
  },
  filesSubContainer: {
    display: "grid",
    textAlign: "center",
    border: "1px solid #cccccc",
    borderRadius: "5px",
    margin: "10px",
    boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
  },
  noFileFound: {
    fontSize: "medium",
    color: "#7a7a7a",
    boxShadow: " 2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
    padding: "10px",
    margin: "20px",
    border: "1px solid #ececec",
  },
  addFileContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "30px 0 0 30px",
  },
  addFile: {
    fontSize: "smaller",
    border: "1px solid #b795bc",
    padding: "10px",
    boxShadow: "3px 3px 3px 1px #e4bfed",
    borderRadius: "10px",
    color: "white",
    background: "#a849c0",
    cursor: "pointer",
  },
  modalAddFile: {
    display: "inline-grid",
    textAlign: "center",
    border: "1px solid grey",
    padding: "35px",
  },
  inputFile: { marginBottom: "10px", color: "white", background: "#888888" },
  fileUploadBtn: {
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

export default function Document(props) {
  const classes = useStyles();
  const history = useHistory();
  const [documentData, setDocumentData] = useState({});
  const [open, setOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");
  const [documentFile, setDocumentFile] = useState({});
  const [isFileAdded, setIsFileAdded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [tenantsList, setTenantsList] = useState([]);
  const [currentTenant, setCurrentTenant] = useState("");

  const handleCloseSnackBar = () => {
    setSnackbarOpen(false);
  };

  const fetchDocumentId = () => {
    const pathname = window.location.pathname;
    const pattern = /\/document\/(.*)/;
    const match = pathname.match(pattern);
    const isExistingVal = match ? decodeURIComponent(match[1]) : null;
    const isExisting = isExistingVal ? true : false;
    setIsExisting(isExisting);
    return isExistingVal;
  };

  const fetchData = async (existingDocument) => {
    const token = localStorage.getItem("token");
    axios.defaults.baseURL = backendURL;
    axios.defaults.headers.common["Authorization"] = `${token}`;
    const response = await axios.get(`/document/${existingDocument}`);

    const { data: dataVal } = response;
    const { document } = dataVal.data || {};

    const {
      _id,
      title,
      file,
      tenant,
      category,
      accessPermissions,
      createdAt,
    } = document;

    const dataToSet = {
      _id,
      title,
      file,
      tenant,
      category,
      accessPermissions,
      createdAt,
    };
    if (file && Object.values(file).length) {
      setImageSrc(`data:${file.type};base64, ${file.data}`);
    }

    setCurrentTenant(tenant._id);
    setDocumentData(dataToSet);
  };

  useEffect(() => {
    const existingDocument = fetchDocumentId();
    if (!existingDocument) {
      setIsDisabled(false);
    } else {
      fetchData(existingDocument);
    }
  }, []);
  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Authorization"] = `${token}`;
      const tenantResponse = await axios.get("/tenant/");

      const { data: tenantData } = tenantResponse;
      const { tenants } = tenantData.data || [];

      const tenantsList = tenants.map((prop) => {
        const { name, _id } = prop;
        return { name, _id };
      });

      setTenantsList(tenantsList);
    } catch (error) {
      console.log("Error While fetching Tenants : ", error);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleSave = () => {
    if (isExisting) {
      handleUpdateData();
    } else {
      handleSaveData();
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    const { name, type } = file;

    reader.onload = (e) => {
      const base64 = e.target.result;
      const data = base64.split("base64,")[1];
      const fileData = {
        name,
        type,
        data,
      };

      setDocumentFile(fileData);
      setDocumentData((prevState) => ({
        ...prevState,
        file: fileData,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleFileDelete = (e, file, newFile) => {
    if (newFile) {
      setDocumentFile({});
    }
    setDocumentData((prevState) => ({
      ...prevState,
      file: {},
    }));
  };

  const handleFileAddition = () => {
    if (documentFile && Object.values(documentFile).length) {
      setIsFileAdded(true);
      setTimeout(() => setOpen(false), 5000);
    }
  };

  const handleChange = (event, key, data, action) => {
    const value = event.target.value;

    setDocumentData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleUpdateData = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.defaults.headers.common["Authorization"] = `${token}`;
      const documentId = documentData._id;
      const response = await axios.patch(
        `/document/${documentId}`,
        documentData
      );
      if (response && response.data && response.data.data) {
        setIsDisabled(true);
        setSnackbarSeverity("success");
        setSnackbarColor("#03811a");
        setSnackbarMessage("Document data Updated successfully!");
        setSnackbarOpen(true);
        setTimeout(() => history.push(`/documents`), 3000);
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

      const response = await axios.post(`/document/`, documentData);

      if (response && response.data && response.data.data) {
        setSnackbarSeverity("success");
        setSnackbarColor("#03811a");
        setSnackbarMessage("Document Added successfully!");
        setSnackbarOpen(true);
        setTimeout(() => history.push(`/documents`), 3000);
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

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const downloadFile = () => {
    const byteCharacters = atob(documentData.file.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: documentData.file.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = documentData.file.name;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleImageError = () => {
    setImageSrc(filePlaceHolderImage);
  };

  const handleCurrentData = (event, key) => {
    const value = event.target.value;
    if (key === "tenant") setCurrentTenant(value);
    setDocumentData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const tenantsMenuItem = tenantsList.map((option) => (
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
                  {"Document Details"}
                </b>
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Title"
                    id="title"
                    formControlProps={{
                      fullWidth: true,
                      disabled: isDisabled,
                    }}
                    inputProps={{
                      value: documentData?.title,
                      handleChange,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <div>
                    <InputLabel
                      className={classes.smallerFont}
                      id="select-label"
                    >
                      Tenant
                    </InputLabel>
                    <Select
                      className={classes.smallFont}
                      labelId="tenant"
                      disabled={isExisting}
                      value={currentTenant}
                      onChange={(e) => handleCurrentData(e, "tenant")}
                      fullWidth={true}
                    >
                      {tenantsMenuItem}
                    </Select>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                  <div>
                    <InputLabel
                      className={classes.smallerFont}
                      id="select-label"
                    >
                      Category
                    </InputLabel>
                    <Select
                      disabled={isDisabled}
                      className={classes.smallFont}
                      labelId="category"
                      value={documentData.category ? documentData.category : ""}
                      onChange={(e) => handleChange(e, "category")}
                      fullWidth={true}
                    >
                      <MenuItem value="lease">lease</MenuItem>
                      <MenuItem value="contract">contract</MenuItem>
                      <MenuItem value="insurance">insurance</MenuItem>
                      <MenuItem value="other">other</MenuItem>
                    </Select>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                  {isDisabled ? (
                    <></>
                  ) : (
                    <div className={classes.addFileContainer}>
                      <buttton
                        disabled={isDisabled}
                        onClick={handleOpen}
                        className={classes.addFile}
                      >
                        {documentData &&
                        documentData.file &&
                        Object.keys(documentData.file).length
                          ? "Replace"
                          : "Add"}{" "}
                        File
                      </buttton>
                    </div>
                  )}
                  <div
                    className={classes.fileLoaderContainer}
                    disabled={isDisabled}
                  >
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-title"
                      aria-describedby="modal-description"
                      width="70%"
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
                        }}
                      >
                        <div className={classes.modalAddFile}>
                          <h3>Add File</h3>
                          <br />
                          <input
                            type="file"
                            className={classes.inputFile}
                            onChange={handleFileInputChange}
                          />

                          {Object.values(documentFile).length > 0 &&
                          isFileAdded == true ? (
                            <span
                              className={classes.blink}
                              style={{ color: "#009c00" }}
                            >
                              File Added, Please click on <b>Save</b> button to
                              upload it
                            </span>
                          ) : (
                            <button
                              className={classes.fileUploadBtn}
                              onClick={handleFileAddition}
                            >
                              Add
                            </button>
                          )}
                          <div className={classes.filesContainer}>
                            {Object.values(documentFile).length > 0 ? (
                              <div className={classes.filesSubContainer}>
                                <img
                                  height={100}
                                  width={100}
                                  src={`data:${documentFile.type};base64, ${documentFile.data}`}
                                ></img>
                                {isDisabled ? null : (
                                  <span>
                                    <Tooltip title="Delete">
                                      <DeleteIcon
                                        onClick={(e) =>
                                          handleFileDelete(
                                            e,
                                            documentFile,
                                            true
                                          )
                                        }
                                        style={{
                                          height: "20px",
                                          color: "#dc4747",
                                          cursor: "pointer  ",
                                        }}
                                      ></DeleteIcon>
                                    </Tooltip>
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className={classes.noFileFound}>
                                No file selected
                              </div>
                            )}
                          </div>
                        </div>
                      </Box>
                    </Modal>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={1} />
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <div className={classes.filesContainer}>
                    {documentData &&
                    documentData.file &&
                    Object.values(documentData.file).length ? (
                      <div className={classes.filesSubContainer}>
                        <img
                          height={100}
                          width={100}
                          src={imageSrc}
                          style={{ padding: 5 }}
                          onError={handleImageError}
                        ></img>
                        {isDisabled ? null : (
                          <span>
                            <Tooltip title="Download">
                              <GetAppIcon
                                onClick={(e) => downloadFile(e)}
                                style={{
                                  height: "20px",
                                  color: "#018a10",
                                  cursor: "pointer  ",
                                }}
                              ></GetAppIcon>
                            </Tooltip>
                            &nbsp;
                            <Tooltip title="Delete">
                              <DeleteIcon
                                onClick={(e) =>
                                  handleFileDelete(e, documentData.file, false)
                                }
                                style={{
                                  height: "20px",
                                  color: "#dc4747",
                                  cursor: "pointer  ",
                                }}
                              ></DeleteIcon>
                            </Tooltip>
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className={classes.noFileFound}>No file found</div>
                    )}
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
