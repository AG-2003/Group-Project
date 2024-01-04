import React, { useState, useRef, useEffect } from "react";
import "./navItem.scss"; // Make sure to import the SCSS file for styles
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type NavItemProps = {
  label: string;
  children?: React.ReactNode;
};

const NavItem: React.FC<NavItemProps> = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="nav-item" ref={ref}>
      <button type="button" onClick={toggleOpen} className="dropdown-toggle">
        {label} {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>
      {isOpen && <div className="dropdown-content">{children}</div>}
    </div>
  );
};

export default NavItem;

