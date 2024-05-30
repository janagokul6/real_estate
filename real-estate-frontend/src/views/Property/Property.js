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
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@material-ui/core/Tooltip";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

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

export default function PropertyProfile(props) {
  const classes = useStyles();
  const history = useHistory();
  const [propertyData, setPropertyData] = useState({});
  const [open, setOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");
  const [isImageAdded, setIsImageAdded] = useState(false);
  const [imageList, setImageList] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const { name, type } = file;
    reader.onloadend = () => {
      const data = reader.result.split("base64,")[1];
      const imageData = {
        name,
        type,
        data,
      };
      const imagesList = [...imageList, imageData];

      setImageList(imagesList);
    };
  };

  const handleImageDelete = (e, image) => {
    const { name, type } = image;
    const imagesArray = imageList.filter((obj) => obj.name !== name);
    setImageList(imagesArray);
  };

  const handleImageAddition = () => {
    if (imageList && imageList.length) {
      setIsImageAdded(true);
      setTimeout(() => setOpen(false), 5000);
    }
  };
  const handlePropertyStatus = (event) => {
    setSelectPropertyStatus(event.target.value);
  };
  const handleCloseSnackBar = () => {
    setSnackbarOpen(false);
  };

  const fetchPropertyId = () => {
    const pathname = window.location.pathname;
    const pattern = /\/property\/(.*)/;
    const match = pathname.match(pattern);
    const isExistingVal = match ? decodeURIComponent(match[1]) : null;
    const isExisting = isExistingVal ? true : false;
    setIsExisting(isExisting);
    return isExistingVal;
  };

  const handleChange = (event, key, data, action) => {
    let value = event.target.value;
    if (key) {
      if (key === "images") {
        let { images } = propertyData;
        if (action && action === "delete") {
          const imageToRemove = data.name;
          images = images.filter((obj) => obj.name !== imageToRemove);
          value = images;
        }
      }
    }
    setPropertyData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const fetchData = async (existingProperty) => {
    const token = localStorage.getItem("token");
    axios.defaults.baseURL = backendURL;
    axios.defaults.headers.common["Authorization"] = `${token}`;
    const response = await axios.get(`/property/${existingProperty}`);
    const { data: dataVal } = response;
    const { property } = dataVal.data || {};

    const {
      _id,
      title,
      desc,
      street,
      city,
      state,
      pin,
      lat,
      long,
      status,
      images,
    } = property;

    const data = {
      _id,
      title,
      desc,
      street,
      city,
      state,
      pin,
      lat,
      long,
      status,
      images,
    };
    setPropertyData(data);
  };

  useEffect(() => {
    const existingProperty = fetchPropertyId();
    if (!existingProperty) {
      setIsDisabled(false);
    } else {
      fetchData(existingProperty);
    }
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
      const formData = new FormData();
      const propertyId = propertyData._id;

      propertyData.images = propertyData.images.concat(imageList);
      delete propertyData._id;

      const response = await axios.patch(
        `/property/${propertyId}`,
        propertyData
      );
      if (response && response.data && response.data.data) {
        setIsDisabled(true);
        setSnackbarSeverity("success");
        setSnackbarColor("#03811a");
        setSnackbarMessage("Property data Updated successfully!");
        setSnackbarOpen(true);
        setTimeout(() => history.push(`/properties`), 3000);
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
      propertyData.images = imageList;

      const response = await axios.post(`/property/`, propertyData);
      if (response && response.data && response.data.data) {
        setSnackbarSeverity("success");
        setSnackbarColor("#03811a");
        setSnackbarMessage("Property Added successfully!");
        setSnackbarOpen(true);
        setTimeout(() => history.push("/properties"), 2000);
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
                  {"Property Details"}
                </b>
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={2}>
                  <CustomInput
                    labelText="Title"
                    id="title"
                    formControlProps={{
                      fullWidth: true,
                      disabled: isExisting,
                    }}
                    inputProps={{
                      value: propertyData?.title,
                      handleChange,
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Description"
                    id="desc"
                    formControlProps={{
                      fullWidth: true,
                      disabled: isDisabled,
                    }}
                    inputProps={{
                      value: propertyData.desc,
                      handleChange,
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Street"
                    id="street"
                    formControlProps={{
                      fullWidth: true,
                      disabled: isDisabled,
                    }}
                    inputProps={{
                      value: propertyData?.street,
                      handleChange,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                  <CustomInput
                    labelText="City"
                    id="city"
                    formControlProps={{
                      fullWidth: true,
                      disabled: isDisabled,
                    }}
                    inputProps={{
                      value: propertyData?.city,
                      handleChange,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="State"
                    id="state"
                    formControlProps={{
                      fullWidth: true,
                      disabled: isDisabled,
                    }}
                    inputProps={{
                      value: propertyData?.state,
                      handleChange,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                  <CustomInput
                    labelText="Pincode"
                    id="pin"
                    formControlProps={{
                      fullWidth: true,
                      disabled: isDisabled,
                    }}
                    inputProps={{
                      value: propertyData.pin,
                      maxLength: 6,
                      handleChange,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
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
                      value={propertyData.status ? propertyData.status : ""}
                      onChange={(e) => handleChange(e, "status")}
                      fullWidth={true}
                    >
                      <MenuItem value="available">available</MenuItem>
                      <MenuItem value="rented">rented</MenuItem>
                      <MenuItem value="under maintenance">maintenance</MenuItem>
                      <MenuItem value="sold">sold</MenuItem>
                    </Select>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                  {isDisabled ? (
                    <></>
                  ) : (
                    <div className={classes.addImageContainer}>
                      <buttton
                        disabled={isDisabled}
                        onClick={handleOpen}
                        className={classes.addImage}
                      >
                        Add Image
                      </buttton>
                    </div>
                  )}
                  <div
                    className={classes.imageLoaderContainer}
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
                          // width: 650,
                        }}
                      >
                        <div className={classes.modalAddImage}>
                          <h3>Add Image</h3>
                          <br />
                          <input
                            className={classes.inputFile}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          {imageList.length > 0 && isImageAdded == true ? (
                            <span
                              className={classes.blink}
                              style={{ color: "#009c00" }}
                            >
                              Images Added, Please click on <b>Save</b> button
                              to upload it
                            </span>
                          ) : (
                            <button
                              className={classes.imageUploadBtn}
                              onClick={handleImageAddition}
                            >
                              Add Images
                            </button>
                          )}
                          <div className={classes.imagesContainer}>
                            {imageList && imageList.length ? (
                              imageList.map((image, key) => (
                                <div className={classes.imagesSubContainer}>
                                  <img
                                    height={100}
                                    width={100}
                                    src={`data:image/jpeg;base64, ${image.data}`}
                                  ></img>
                                  {isDisabled ? null : (
                                    <span>
                                      <Tooltip title="Delete">
                                        <DeleteIcon
                                          onClick={(e) =>
                                            handleImageDelete(e, image)
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
                              ))
                            ) : (
                              <div className={classes.noImageFound}>
                                No image selected
                              </div>
                            )}
                          </div>
                        </div>
                      </Box>
                    </Modal>
                  </div>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <div className={classes.imagesContainer}>
                    {propertyData &&
                    propertyData.images &&
                    propertyData.images.length ? (
                      propertyData.images.map((image, key) => (
                        <div className={classes.imagesSubContainer}>
                          <img
                            height={100}
                            width={100}
                            src={`data:image/jpeg;base64, ${image.data}`}
                          ></img>
                          {isDisabled ? null : (
                            <span>
                              <Tooltip title="Delete">
                                <DeleteIcon
                                  onClick={(e) =>
                                    handleChange(e, "images", image, "delete")
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
                      ))
                    ) : (
                      <div className={classes.noImageFound}>No image found</div>
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
