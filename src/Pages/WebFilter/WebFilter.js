import React, {useState, useRef} from "react";
import './WebFilter.css';
import SideBar from "../../Menu/Menu";
import {Button, message } from 'antd';
import Loading from "../../Componentes/Loading/Loading";
import Proxy from "./Proxy/Proxy";
import Filter from "./Filter/filter";
import axios from 'axios';

function WebFilter() {

  const [activeTab, setActiveTab] = useState("Proxy");
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
      setActiveTab(tab);
  };

  const applyWebFilter = () => {
    setLoading(true);
    axios.get(`http://172.23.58.10/webfilter/apply`)
      .then(response => {
        setLoading(false);
        message.success(response.data.message);
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
        if(error.code && error.code == "ERR_BAD_REQUEST"){
          if(error.response.data.error){
            message.error(error.response.data.error);
          }else{
            message.error(error.message);
          }
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
        <h1>WebFilter</h1>
        <Button
          type="primary"
          className="Button-apply"
          style={{ marginLeft: '10px' }}
          onClick={applyWebFilter}
        >
          Aplicar
        </Button>
      </div>
      
      <div className="tabs">
        <button
          className={activeTab === "Proxy" ? "active" : ""}
          onClick={() => handleTabChange("Proxy")}
        >
          Proxy
        </button>
        <button
          className={activeTab === "Filter" ? "active" : ""}
          onClick={() => handleTabChange("Filter")}
        >
          Filtros
        </button>
      </div>
      {activeTab === "Proxy" && (
        <Proxy/>
      )}
      {activeTab === "Filter" && (
        <Filter/>
      )}
    </div>
      <SideBar />
    </div>
  );
}

export default WebFilter;