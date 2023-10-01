import React from "react";
import './Menu.css';
import { NavLink, useLocation } from "react-router-dom";
import redeImage from '../rede.png';

function Menu() {
  const location = useLocation();

  return (
    <nav className="menu">
      <img src={redeImage} alt="rede menu"></img>
      <ul>
        <li className={location.pathname === "/" ? "active" : ""}>
          <NavLink to="/">DHCP</NavLink>
        </li>
        <li className={location.pathname === "/firewall" ? "active" : ""}>
          <NavLink to="/firewall">Firewall</NavLink>
        </li>
        <li className={location.pathname === "/webFilter" ? "active" : ""}>
          <NavLink to="/webFilter">Web Filter</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Menu;
