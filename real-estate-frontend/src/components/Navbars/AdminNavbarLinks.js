import React, { useEffect } from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Tooltip from "@material-ui/core/Tooltip";

import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import { useHistory } from "react-router-dom";
import { setSourceMapRange } from "typescript";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);
  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleOpenProfile = () => {
    setOpenProfile(null);
    history.push(`/my-profile`);
  };

  const handleLogIn = () => {
    history.push(`/login`);
  };

  const handleLogOut = () => {
    setOpenProfile(null);
    setIsLoggedIn(false);
    history.push(`/logout`);
  };

  const handleDashboard = () => {
    history.push(`/dashboard`);
  };
  return (
    <div>
      {/* <div className={classes.searchWrapper}>
        <CustomInput
          formControlProps={{
            className: classes.margin + " " + classes.search,
          }}
          inputProps={{
            placeholder: "Search",
            inputProps: {
              "aria-label": "Search",
            },
          }}
        />
        <Button color="white" aria-label="edit" justIcon round>
          <Search />
        </Button>
      </div> */}
      <Button
        color={window.innerWidth > 959 ? "transparent" : "white"}
        justIcon={window.innerWidth > 959}
        simple={!(window.innerWidth > 959)}
        aria-label="Dashboard"
        className={classes.buttonLink}
        onClick={handleDashboard}
      >
        <Tooltip title="Dashboard">
          <Dashboard className={classes.icons} />
        </Tooltip>
        <Hidden mdUp implementation="css">
          <p className={classes.linkText}>Dashboard</p>
        </Hidden>
      </Button>

      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleOpenProfile}
          className={classes.buttonLink}
        >
          <Tooltip title="My Account">
            <AccountBoxIcon className={classes.icons} />
          </Tooltip>
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Account</p>
          </Hidden>
        </Button>
      </div>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleLogOut}
          className={classes.buttonLink}
        >
          <Tooltip title="Logout">
            <ExitToAppIcon className={classes.icons} />
          </Tooltip>
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Account</p>
          </Hidden>
        </Button>
      </div>
    </div>
  );
}
