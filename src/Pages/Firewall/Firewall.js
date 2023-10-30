import React, {useState} from "react";
import './Firewall.css';
import SideBar from "../../Menu/Menu";
import Regras from "./Regras/Regras";
import {Button, Spin, message} from 'antd';
import axios from 'axios';
import Loading from "../../Componentes/Loading/Loading";

function Firewall() {
  const [activeTab, setActiveTab] = useState("Regras");
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const apply = () => {
    setLoading(true);
    axios.post('http://172.23.58.10/api/apply')
      .then(response => {
          setLoading(false);
          message.success(response.data.message);
      })
      .catch(error => {
          setLoading(false);
          console.error(error.message);
          if(error.code == "ERR_BAD_REQUEST"){
              message.error(error.response.data.error);
          }else{
              message.error(error.message);
          }
      }); 
  }


  return (
    <div>
      {loading && <Loading />}
      <div className="right">
      <div className="Header">
        <h1>Firewall</h1>
        <Button
          type="primary"
          className="Button-apply"
          style={{ marginLeft: '10px' }}
          onClick={apply}
        >
          Aplicar
        </Button>
      </div>
      
      <div className="tabs">
        <button
          className={activeTab === "Regras" ? "active" : ""}
          onClick={() => handleTabChange("Regras")}
        >
          Regras
        </button>
      </div>
      {activeTab === "Regras" && (
        <Regras />
      )}
    </div>
      <SideBar />
    </div>
  );
}

export default Firewall;