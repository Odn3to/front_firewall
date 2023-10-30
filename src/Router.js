import React, {useEffect} from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dhcp from "./Pages/DHCP/Dhcp";
import Firewall from "./Pages/Firewall/Firewall";
import WebFilter from "./Pages/WebFilter/WebFilter";
import LoginPage from "./Pages/Login/LoginPage";

function Router() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');

    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Dhcp />} />
        <Route path="/firewall" element={<Firewall />} />
        <Route path="/webFilter" element={<WebFilter />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default Router;