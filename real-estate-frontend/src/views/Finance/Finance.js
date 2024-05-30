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
import moment from "moment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useHistory } from "react-router-dom";
import { config } from "../../config/config";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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

export default function Finance(props) {
  const classes = useStyles();
  const history = useHistory();
  const [financeData, setFinanceData] = useState({});
  const [open, setOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [financeFile, setFinanceFile] = useState({});
  const [isFileAdded, setIsFileAdded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  const handleCloseSnackBar = () => {
    setSnackbarOpen(false);
  };

  const handleDateChange = (e, key) => {
    const value = e;
    setFinanceData((prevState) => ({
      ...prevState,
      [key]: value,
    }));

    if (key === "fromDate") {
      setFromDateOpen(false);
    }
    if (key === "toDate") {
      setToDateOpen(false);
    }
  };

  const onFocus = (e, key) => {
    e.preventDefault();
    if (key === "fromDate") {
      setFromDateOpen(true);
      setToDateOpen(false);
    }
    if (key === "toDate") {
      setFromDateOpen(false);
      setToDateOpen(true);
    }
  };

  const fetchFinanceId = () => {
    const pathname = window.location.pathname;
    const pattern = /\/finance\/(.*)/;
    const match = pathname.match(pattern);
    const isExistingVal = match ? decodeURIComponent(match[1]) : null;
    const isExisting = isExistingVal ? true : false;
    setIsExisting(isExisting);
    return isExistingVal;
  };

  const fetchData = async (existingFinance) => {
    const token = localStorage.getItem("token");
    axios.defaults.baseURL = backendURL;
    axios.defaults.headers.common["Authorization"] = `${token}`;
    const response = await axios.get(`/finance/${existingFinance}`);
    const { data: dataVal } = response;
    const { finance } = dataVal.data || {};

    const { _id, type, fromDate, toDate, data } = finance;

    const dataToSet = {
      _id,
      type,
      fromDate,
      toDate,
      data,
    };
    if (data && Object.values(data).length) {
      setImageSrc(`data:${data.type};base64, ${data.data}`);
    }
    setFinanceData(dataToSet);
  };

  useEffect(() => {
    const existingFinance = fetchFinanceId();
    if (!existingFinance) {
      setIsDisabled(false);
    } else {
      fetchData(existingFinance);
    }
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

      setFinanceFile(fileData);
      setFinanceData((prevState) => ({
        ...prevState,
        data: fileData,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleFileDelete = (e, file, newFile) => {
    if (newFile) {
      setFinanceFile({});
    }

    setFinanceData((prevState) => ({
      ...prevState,
      data: {},
    }));
  };

  const handleFileAddition = () => {
    if (financeFile && Object.values(financeFile).length) {
      setIsFileAdded(true);
      setTimeout(() => setOpen(false), 5000);
    }
  };

  const handleChange = (event, key, data, action) => {
    const value = event.target.value;

    setFinanceData((prevState) => ({
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
      const financeId = financeData._id;
      const response = await axios.patch(`/finance/${financeId}`, financeData);
      if (response && response.data && response.data.data) {
        setIsDisabled(true);
        setSnackbarSeverity("success");
        setSnackbarColor("#03811a");
        setSnackbarMessage("Finance data Updated successfully!");
        setSnackbarOpen(true);
        setTimeout(() => history.push(`/finances`), 3000);
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

      const response = await axios.post(`/finance/`, financeData);

      if (response && response.data && response.data.data) {
        setSnackbarSeverity("success");
        setSnackbarColor("#03811a");
        setSnackbarMessage("Finance Added successfully!");
        setSnackbarOpen(true);
        setTimeout(() => history.push(`/finances`), 3000);
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

  const convertToHyphenSeparated = (str) => {
    return str.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());
  };

  const downloadFile = () => {
    const byteCharacters = atob(financeData.data.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: financeData.data.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = financeData.data.name;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleImageError = () => {
    setImageSrc(filePlaceHolderImage);
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
                <b>
                  {isExisting ? "Update" : "Add"}
                  &nbsp;
                  {"Finance Details"}
                </b>
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={2}>
                  <div>
                    <InputLabel
                      className={classes.smallerFont}
                      id="select-label"
                    >
                      Type
                    </InputLabel>
                    <Select
                      disabled={isExisting}
                      className={classes.smallFont}
                      labelId="type"
                      value={financeData.type ? financeData.type : ""}
                      onChange={(e) => handleChange(e, "type")}
                      fullWidth={true}
                    >
                      <MenuItem value="profitLoss">profit-loss</MenuItem>
                      <MenuItem value="balanceSheet">balance-sheet</MenuItem>
                      <MenuItem value="cashFlow">cash-flow</MenuItem>
                    </Select>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  {fromDateOpen ? (
                    <div>
                      <Calendar
                        onChange={(e) => handleDateChange(e, "fromDate")}
                        value={
                          financeData && financeData.fromDate
                            ? financeData.fromDate
                            : ""
                        }
                      />
                    </div>
                  ) : (
                    <div>
                      <CustomInput
                        labelText="From(date)"
                        id="fromDate"
                        formControlProps={{
                          fullWidth: true,
                          disabled: isDisabled,
                        }}
                        inputProps={{
                          value:
                            financeData && financeData.fromDate
                              ? moment(financeData.fromDate).format(
                                  "DD MMMM, YYYY"
                                )
                              : "",
                          handleChange,
                          onFocus,
                        }}
                      />
                    </div>
                  )}
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  {toDateOpen ? (
                    <div>
                      <Calendar
                        onChange={(e) => handleDateChange(e, "toDate")}
                        value={
                          financeData && financeData.toDate
                            ? financeData.toDate
                            : ""
                        }
                      />
                    </div>
                  ) : (
                    <CustomInput
                      labelText="To(date)"
                      id="toDate"
                      formControlProps={{
                        fullWidth: true,
                        disabled: isDisabled,
                      }}
                      inputProps={{
                        value:
                          financeData && financeData.toDate
                            ? moment(financeData.toDate).format("DD MMMM, YYYY")
                            : "",
                        handleChange,
                        onFocus,
                      }}
                    />
                  )}
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
                        {financeData &&
                        financeData.data &&
                        Object.keys(financeData.data).length
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

                          {Object.values(financeFile).length > 0 &&
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
                            {Object.values(financeFile).length > 0 ? (
                              <div className={classes.filesSubContainer}>
                                <img
                                  height={100}
                                  width={100}
                                  src={`data:file/jpeg;base64, ${financeFile.data}`}
                                ></img>
                                {isDisabled ? null : (
                                  <span>
                                    <Tooltip title="Delete">
                                      <DeleteIcon
                                        onClick={(e) =>
                                          handleFileDelete(e, financeFile, true)
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
                    {financeData &&
                    financeData.data &&
                    Object.values(financeData.data).length ? (
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
                                  handleFileDelete(e, financeData.data, false)
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
