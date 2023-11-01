import React, {useState, useRef, useEffect} from "react";
import './WebFilter.css';
import SideBar from "../../Menu/Menu";
import {Button, message } from 'antd';
import Loading from "../../Componentes/Loading/Loading";
import Filter from "./Filter/filter";
import AlertBalloon from '../DHCP/AlertStatus/AlertBallon.js'
import axios from 'axios';

function WebFilter() {

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ text: 'ATIVADO', class: 'alert-green' });
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    getStatus();
  }, []);

  const getStatus = () => {
    axios.get('http://172.23.58.10/webfilter/status', { headers: {
      "Authorization": token
    }})
      .then(response => {
        setStatus(response.data);
      })
      .catch(error => {
          console.error(error.message);
          if(error.response.data.error == "Invalid token"){
            localStorage.clear();
          } else if(error.code == "ERR_BAD_REQUEST"){
              message.error(error.response.data.error);
          }else{
              message.error(error.message);
          }
      });
  }

  const applyWebFilter = () => {
    setLoading(true);
    axios.get(`http://172.23.58.10/webfilter/apply`, { headers: {
      "Authorization": token
    }})
      .then(response => {
        setLoading(false);
        message.success(response.data.message);
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
        if(error.response.data.error == "Invalid token"){
          localStorage.clear();
        } else if(error.code && error.code == "ERR_BAD_REQUEST"){
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
        <AlertBalloon status={status} style={{ boxShadow: '0px 3px 10px rgba(0,0,0,0.1)' }}/>
        <Button
          type="primary"
          className="Button-apply"
          style={{ marginLeft: '10px' }}
          onClick={applyWebFilter}
        >
          Aplicar
        </Button>
      </div>
      <Filter/>
    </div>
      <SideBar />
    </div>
  );
}

export default WebFilter;