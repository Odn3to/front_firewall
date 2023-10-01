import React, { useState, useEffect } from "react";
import './form_firewall.css';
import Input from "../../../Componentes/Input/Input";
import Loading from "../../../Componentes/Loading/Loading";
import Message from "../../../Componentes/Message/Message";

function Form_firewall() {

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interfaceVal, setInterfaceVal] = useState("");

  useEffect(() => {
    
  }, []);

  const handleSubmit = () => {

  } 

  return (
    <form onSubmit={handleSubmit} className="formulario">
        {loading && <Loading />}
        {message && <Message message={message} isSuccess={isSuccess}/>}
        <div className="container">
          <Input id_prop="interface" label_prop="Interface" placeholder_prop="Digite sua interface"
              value_prop={interfaceVal} onChange_prop={e => setInterfaceVal(e.target.value)} />
        </div>
        <div className="container-button">
            <button type="submit" >Aplicar Regra</button>
        </div>
    </form>
  );
}

export default Form_firewall;