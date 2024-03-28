import "./navbar.scss";
import logo from "../../assets/logo.png";
import name from "../../assets/name.png";
import { Link } from "react-router-dom";
import NavItem from "./navItem";
import { Box } from "@chakra-ui/react";

export const Navbar: React.FC = () => {
  return (
    <nav className="nav-bar">

      <div className="logo-and-name">
        <img src={logo} alt="Joints Logo" className="logo" />
        <img src={name} alt="Joints" className="name" />
      </div>
      <Box display='flex' justifyContent='space-between' width={60}>
        <Link to="/auth">
          <button className="get-started">Get Started</button>
        </Link>
        <Link to='/policy'>
          <button className="get-started">Policies</button>
        </Link>
      </Box>


    </nav>
  );
};

export default Navbar;
