import "./NavBar.scss";
import logo from "../../assets/logo.png";
import name from "../../assets/name.png";
import { Link } from "react-router-dom";
import NavItem from "./NavItem";

export const Navbar: React.FC = () => {
  return (
    <nav className="nav-bar">
      <div className="logo-and-name">
        <img src={logo} alt="Joints Logo" className="logo" />
        <img src={name} alt="Joints" className="name" />
      </div>
      <div className="nav-items">
        <NavItem label="Tutorials">
          <a href="#docs">Docs</a>
          <a href="#spreadsheets">Spreadsheets</a>
          <a href="#slides">Slides</a>
          <a href="#whiteboards">Whiteboards</a>
          <a href="#team">Meet the team</a>
        </NavItem>
        <NavItem label="Business">
          <a href="#welcome">Buisness Cards</a>
          <a href="#docs">Calendars</a>
          <a href="#spreadsheets">Logos</a>
          <a href="#slides">Posters</a>
          <a href="#whiteboards">Flyers</a>
          <a href="#team">Brochures</a>
          <a href="#team">Infographics</a>
        </NavItem>
        <NavItem label="Creators">
          <a href="#welcome">Thumbnails</a>
          <a href="#docs">Posts</a>
          <a href="#spreadsheets">Websites</a>
          <a href="#slides">Newsletters</a>
        </NavItem>
        <NavItem label="Education">
          <a href="#welcome">Mind Maps</a>
          <a href="#docs">Schedules</a>
          <a href="#spreadsheets">Essays</a>
          <a href="#slides">Worksheets</a>
          <a href="#whiteboards">Curriculum Vitae</a>
        </NavItem>
      </div>
      <Link to="/auth">
        <button className="get-started">Get Started</button>
      </Link>
    </nav>
  );
};

export default Navbar;
