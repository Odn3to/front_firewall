import React from "react";
import './Menu.css';
import { Link } from "react-router-dom";
import redeImage from '../rede.png';

function Menu() {

  return (
    <div className="menu">
      <img src={redeImage} alt="rede menu"></img>
      <Link to="/">DHCP</Link>
      <Link to="/firewall">Firewall</Link>
      <Link to="/webFilter">WebFilter</Link>
    </div>
  );
}

export default Menu;
