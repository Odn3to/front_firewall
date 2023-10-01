import React, { useState, useEffect } from "react";
import Input from "../../../Componentes/Input/Input";
import './Formulario.css';
import axios from 'axios';
import {calculaSubNet} from '../../../utils/utils.js';
import Loading from "../../../Componentes/Loading/Loading";
import Message from "../../../Componentes/Message/Message";

const regexIpv4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i;

const Formulario = () => {

    const [interfaceVal, setInterfaceVal] = useState("");
    const [gatewayVal, setGatewayVal] = useState("");
    const [subNetVal, setSubNetVal] = useState("");
    const [rangeInicialVal, setRangeInicialVal] = useState("");
    const [rangeFinalVal, setRangeFinalVal] = useState("");
    const [leaseVal, setLeaseVal] = useState("");
    const [primarioVal, setPrimarioVal] = useState("");
    const [secundarioVal, setSecundarioVal] = useState("");

    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getInitConf();
    }, []);

    const getInitConf = () => {
        setLoading(true);
        axios.get('http://172.23.58.10/api/initConf')
            .then(response => {
                setLoading(false);
                if(response.data && Object.keys(response.data).length !== 0){
                    setGatewayVal(response.data.data.gateway || "");
                    setInterfaceVal(response.data.data.netInterface || "");
                    setSubNetVal(response.data.data.subNet || "");
                    setRangeInicialVal(response.data.data.rangeInicial || "");
                    setRangeFinalVal(response.data.data.rangeFinal || "");
                    setLeaseVal(response.data.data.lease || "");
                    setPrimarioVal(response.data.data.dnsPrimario || "");
                    setSecundarioVal(response.data.data.dnsSecundario || "");
                }
            })
            .catch(error => {
                setLoading(false);
                console.error(error.message);
                setMessage(error.message);
                timePopUp();
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            netInterface: interfaceVal,
            gateway: gatewayVal,
            subNet: subNetVal,
            rangeInicial: rangeInicialVal,
            rangeFinal: rangeFinalVal,
            lease: leaseVal,
            primario: primarioVal,
            secundario: secundarioVal
        };


        let text = 'Campos inválidos: ';


        const condition = !regexIpv4.test(gatewayVal) | !regexIpv4.test(rangeInicialVal) | !regexIpv4.test(rangeFinalVal)
            | !regexIpv4.test(primarioVal) | !regexIpv4.test(secundarioVal) | isNaN(leaseVal);

        if (condition) {
            let init = true;
            if (!regexIpv4.test(gatewayVal)) {
                init = false;
                text += 'Gateway ';
            }
            if (!regexIpv4.test(rangeInicialVal)) {
                if (!init) {
                    text += ', ';
                }
                init = false;
                text += 'Range Inicial ';
            }
            if (!regexIpv4.test(rangeFinalVal)) {
                if (!init) {
                    text += ', ';
                }
                init = false;
                text += 'Range Final  ';
            }
            if (!regexIpv4.test(primarioVal)) {
                if (!init) {
                    text += ', ';
                }
                init = false;
                text += 'DNS Primário ';
            }
            if (!regexIpv4.test(secundarioVal)) {
                if (!init) {
                    text += ', ';
                }
                init = false;
                text += 'DNS Secundário ';
            }
            if (isNaN(leaseVal)) {
                if (!init) {
                    text += ', ';
                }
                init = false;
                text += 'Lease ';
            }
            text += '.';

            setLoading(false);
            setMessage(text);
            timePopUp();
            return;
        }

        //Validador de SubNet
        const gatewayIsInSubnet = calculaSubNet(subNetVal, gatewayVal);

        if (!gatewayIsInSubnet) {
            setLoading(false);
            setMessage("A sub-rede deve estar contida no gateway!");
            timePopUp();
            return;
        }

        axios.post('http://172.23.58.10/api/conf', data)
            .then(response => {
                setLoading(false);
                setIsSuccess(true);
                setMessage(response.data.message);
                timePopUp();
            })
            .catch(error => {
                setLoading(false);
                console.error(error.message);
                if(error.code == "ERR_BAD_REQUEST"){
                    setMessage(error.response.data.error);
                }else{
                    setMessage(error.message);
                }
                timePopUp();
            }); 
    }

    const timePopUp = () => {
        setTimeout(() => {
            setIsSuccess(false);
            setMessage('');
        }, 2000);
    }

    return (
        <form onSubmit={handleSubmit} className="formulario">
            {loading && <Loading />}
            {message && <Message message={message} isSuccess={isSuccess}/>}
            <div className="container">
                <Input id_prop="interface" label_prop="Interface" placeholder_prop="Digite sua interface"
                    value_prop={interfaceVal} onChange_prop={e => setInterfaceVal(e.target.value)} />
                <Input id_prop="gateway" label_prop="Gateway" placeholder_prop="Digite sua Gateway"
                    value_prop={gatewayVal} onChange_prop={e => setGatewayVal(e.target.value)} />
                <Input id_prop="subNet" label_prop="Sub-Net" placeholder_prop="Digite sua SubNet"
                    value_prop={subNetVal} onChange_prop={e => setSubNetVal(e.target.value)} />
                <Input id_prop="rangeInicial" label_prop="Range Inicial" placeholder_prop="Digite o Range Inicial"
                    value_prop={rangeInicialVal} onChange_prop={e => setRangeInicialVal(e.target.value)} />
            </div>
            <div className="container">
                <Input id_prop="rangeFinal" label_prop="Range Final" placeholder_prop="Digite o Range final"
                    value_prop={rangeFinalVal} onChange_prop={e => setRangeFinalVal(e.target.value)} />
                <Input id_prop="lease" label_prop="Lease" placeholder_prop="Digite o Lease"
                    value_prop={leaseVal} onChange_prop={e => setLeaseVal(e.target.value)} />
                <Input id_prop="primario" label_prop="DNS Primário" placeholder_prop="DNS Primário"
                    value_prop={primarioVal} onChange_prop={e => setPrimarioVal(e.target.value)} />
                <Input id_prop="secundario" label_prop="DNS Secundário" placeholder_prop="DNS Secundário"
                    value_prop={secundarioVal} onChange_prop={e => setSecundarioVal(e.target.value)} />
            </div>
            <div className="container-button">
                <button type="submit" >Configurar DHCP</button>
            </div>
        </form>
    )
}

export default Formulario;