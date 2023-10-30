import React, {useEffect, useState} from "react";
import './Dhcp.css';
import Formulario from './Fomulario/Formulario'
import Leases from "./ListaLeases/Leases";
import AlertBalloon from "./AlertStatus/AlertBallon";
import SideBar from "../../Menu/Menu";
import axios from "axios";

function Dhcp() {
  const [status, setStatus] = useState({ text: 'NÃO ATIVADO', class: 'alert-red' });

  useEffect(() => {
    getStatus();
  }, [])

  const getStatus = () => {
    const token = localStorage.getItem('userToken');

    axios.get('http://172.23.58.10/dhcp/dhcp/status', { headers: {
      "Authorization": token
    }})
      .then(response => {
        setStatus({ text: response.data.text, class: response.data.class });
      })
      .catch(error => {
        if(error.response.data.error == "Invalid token"){
          localStorage.clear();
        }
          console.error(error);
      });
  }


  return (
    <div>
      <div className="right">
        <div className="App">
          <h1>Configuração - DHCP</h1>
          <AlertBalloon status={status}/>
        </div>
        <Formulario />
        <Leases />
      </div>
      <SideBar />
    </div>
  );
}

export default Dhcp;
