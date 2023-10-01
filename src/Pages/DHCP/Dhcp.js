import React, {useEffect, useState} from "react";
import './Dhcp.css';
import Formulario from './Fomulario/Formulario'
import Leases from "./ListaLeases/Leases";
import AlertBalloon from "./AlertStatus/AlertBallon";
import Menu from "../../Menu/Menu";
import axios from "axios";

function Dhcp() {
  const [status, setStatus] = useState({ text: 'NÃO ATIVADO', class: 'alert-red' });

  useEffect(() => {
    getStatus();
  }, [])

  const getStatus = () => {
    axios.get('http://172.23.58.10/api/status')
      .then(response => {
        setStatus({ text: response.data.status.text, class: response.data.status.class });
      })
      .catch(error => {
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
      <Menu />
    </div>
  );
}

export default Dhcp;
