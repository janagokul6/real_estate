// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import ConstructionIcon from "@mui/icons-material/Construction";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import DescriptionIcon from "@mui/icons-material/Description";
// core components/views for  layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import Rents from "views/Rents/Rents";
import Tenants from "views/Tenants/Tenants.js";
import Properties from "views/Properties/Properties";
import Maintenances from "views/Maintenances/Maintenances";
import Expenses from "views/Expenses/Expenses";
import Finances from "views/Finances/Finances";
import Documents from "views/Documents/Documents";
// core components/views for RTL layout

const dashboardRoutes = [
  {
    path: "dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/",
  },
  {
    path: "tenants",
    name: "Tenants",
    rtlName: "قائمة الجدول",
    icon: GroupIcon,
    component: Tenants,
    layout: "/",
  },
  {
    path: "properties",
    name: "Properties",
    rtlName: "قائمة الجدول",
    icon: MapsHomeWorkIcon,
    component: Properties,
    layout: "/",
  },
  {
    path: "rents",
    name: "Rents",
    rtlName: "قائمة الجدول",
    icon: NightShelterIcon,
    component: Rents,
    layout: "/",
  },
  {
    path: "maintenances",
    name: "Maintenances",
    icon: ConstructionIcon,
    component: Maintenances,
    layout: "/",
  },
  {
    path: "expenses",
    name: "Expenses",
    icon: AccountBalanceWalletIcon,
    component: Expenses,
    layout: "/",
  },
  {
    path: "finances",
    name: "Finances",
    icon: RequestQuoteIcon,
    component: Finances,
    layout: "/",
  },
  {
    path: "documents",
    name: "Documents",
    icon: DescriptionIcon,
    component: Documents,
    layout: "/",
  },
];

export default dashboardRoutes;
