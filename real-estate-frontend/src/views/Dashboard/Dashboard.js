import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import AccessTime from "@material-ui/icons/AccessTime";
import NumbersIcon from "@mui/icons-material/Numbers";
import PeopleIcon from "@mui/icons-material/People";
import NightShelterIcon from "@mui/icons-material/NightShelter";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import axios from "axios";
import { config } from "../../config/config";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
const { backendURL } = config;

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const history = useHistory();
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [tenantsCount, setTenantsCount] = useState(0);
  const [rentsCount, setRentsCount] = useState(0);
  const [tenantsChartData, setTenantsChartData] = useState([]);
  const [propertiesChartData, setPropertiesChartData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tenants per Month",
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Properties Status",
      },
    },
  };

  const labels = [
    "Jan",
    "Febr",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Tenants",
        data: tenantsChartData,
        backgroundColor: "#e93d39",
      },
    ],
  };

  const pieData = {
    labels: ["Available", "Rented", "Sold", "Maintenance"],
    datasets: [
      {
        label: "Properties",
        data: propertiesChartData,
        backgroundColor: [
          "rgba(230, 164, 0, 0.35)",
          "rgba(54, 162, 235, 0.35)",
          "rgba(75, 192, 192, 0.35)",
          "rgba(255, 99, 132, 0.35)",
        ],
        borderColor: [
          "rgba(230, 164, 0, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.baseURL = backendURL;
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.defaults.headers.common["Authorization"] = `${token}`;
      const propertiesResponse = await axios.get(`/dashboard/property`);
      const propertiesResp =
        propertiesResponse &&
        propertiesResponse.data &&
        propertiesResponse.data.data
          ? propertiesResponse.data.data
          : {};
      const {
        totalCounts: propertiesTotalCounts,
        dateCounts: propertiesDateCounts,
        statusCounts: propertiesStatusCount,
      } = propertiesResp;

      const propertiesStatus = Array.from({ length: 4 }, () => 0);

      propertiesStatusCount.map((el) => {
        if (el.status === "available") propertiesStatus[0] = el.count;
        if (el.status === "rented") propertiesStatus[1] = el.count;
        if (el.status === "sold") propertiesStatus[2] = el.count;
        if (el.status === "under maintenance") propertiesStatus[3] = el.count;
      });
      setPropertiesCount(propertiesTotalCounts);
      setPropertiesChartData(propertiesStatus);

      const tenantsResponse = await axios.get(`/dashboard/tenant`);
      const tenantsResp =
        tenantsResponse && tenantsResponse.data && tenantsResponse.data.data
          ? tenantsResponse.data.data
          : {};
      const {
        totalCounts: tenantsTotalCounts,
        dateCounts: tenantsDateCounts,
      } = tenantsResp;

      const tenantsMonthlyData = Array.from({ length: 12 }, () => 0);
      tenantsResp.dateCounts.forEach(({ month, count }) => {
        tenantsMonthlyData[month - 1] = count;
      });
      setTenantsCount(tenantsTotalCounts);
      setTenantsChartData(tenantsMonthlyData);

      const rentsResponse = await axios.get(`/dashboard/rent`);
      const rentsResp =
        rentsResponse && rentsResponse.data && rentsResponse.data.data
          ? rentsResponse.data.data
          : {};
      const {
        totalCounts: rentsTotalCounts,
        dateCounts: rentsDateCounts,
      } = rentsResp;

      setRentsCount(rentsTotalCounts);
    } catch (error) {
      console.log({ error });
      let errorMessage = error?.response?.data?.error?.message;
      if (error?.response?.status === 403) {
        errorMessage = "Session Expired, Please Login Again";
        localStorage.setItem("token", null);
        localStorage.setItem("lgn", false);
        setTimeout(() => history.push(`/login`), 3000);
      }
      setSnackbarColor("#c21111");
      setSnackbarSeverity("error");
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  useEffect(async () => {
    fetchData();
  }, []);

  const handleCloseSnackBar = () => {
    setSnackbarOpen(false);
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
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Properties</p>
              <h3 className={classes.cardTitle}>{propertiesCount}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <NumbersIcon />
                Total Number of Properties
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <PeopleIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Tenants</p>
              <h3 className={classes.cardTitle}>{tenantsCount}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <NumbersIcon />
                Total Number of Tenants
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <NightShelterIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Rents</p>
              <h3 className={classes.cardTitle}>{rentsCount}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <NumbersIcon />
                Total Number of Rents
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader className={classes.charts}>
              <Pie options={pieOptions} data={pieData} />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Properties</h4>
              <p className={classes.cardCategory}>Listed with us</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Data to analyse the occupancy of Properties
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader className={classes.charts}>
              <Bar options={options} data={data} />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Tenants</h4>
              <p className={classes.cardCategory}>Joined Our Firm</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Data to analyse the traffic of tenants
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
