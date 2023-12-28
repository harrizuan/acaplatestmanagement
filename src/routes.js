import {
  FaTv,
  FaTag,
  FaBuilding,
  FaCameraRetro,
  FaKey,
  FaFileContract,
} from "react-icons/fa";
import Index from "views/Index.js";
import TestSection from "views/TestSection.js";
import Maps from "views/examples/Maps.js";
import Login from "views/examples/Login.js";
import Form from "views/examples/Form.js";
import Asset from "views/examples/Asset";
import Scan from "views/examples/Scan";
import Contract from "views/examples/contract";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <FaTv style={{ color: "#282f68" }} />,
    component: <Index />,
    layout: "/admin",
  },
  // {
  //   path: "/test",
  //   name: "Test",
  //   icon: <FaTv style={{ color: "#282f68" }} />,
  //   component: <TestSection />,
  //   layout: "/admin",
  // },
  {
    path: "/form",
    name: "Form",
    icon: <FaTag style={{ color: "#172b4d" }} />,
    component: <Form />,
    layout: "/admin",
  },
  {
    path: "/asset",
    name: "Asset",
    icon: <FaBuilding style={{ color: "#172b4d" }} />,
    component: <Asset />,
    layout: "/admin",
  },
  {
    path: "/contract",
    name: "Contract",
    icon: <FaFileContract style={{ color: "#172b4d" }} />,
    component: <Contract />,
    layout: "/admin",
  },
  {
    path: "/scan",
    name: "Scan",
    icon: <FaCameraRetro style={{ color: "#172b4d" }} />,
    component: <Scan />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: <FaKey style={{ color: "#172b4d" }} />,
    component: <Login />,
    layout: "/auth",
  },
];

export default routes;
