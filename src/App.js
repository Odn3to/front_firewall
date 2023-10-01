import React, {useEffect, useState} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dhcp from "./Pages/DHCP/Dhcp";
import Firewall from "./Pages/Firewall/Firewall";
import WebFilter from "./Pages/WebFilter/WebFilter";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dhcp />} />
        <Route path="/firewall" element={<Firewall />} />
        <Route path="/webFilter" element={<WebFilter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
