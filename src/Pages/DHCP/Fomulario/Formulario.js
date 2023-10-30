import React, { useState, useEffect, Fragment } from "react";
//import Input from "../../../Componentes/Input/Input";
import './Formulario.css';
import axios from 'axios';
import {calculaSubNet} from '../../../utils/utils.js';
import Loading from "../../../Componentes/Loading/Loading";
import Message from "../../../Componentes/Message/Message";
import {Select, Form, Button, Input, Row, Col, Card} from 'antd';

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
    const [interfaces, setInterfaces] = useState([]);

    const [form] = Form.useForm();

    useEffect(() => {
        getInitConf();
        getInterfaces();
    }, []);

    const getInterfaces = () => {
        setLoading(true);
        const token = localStorage.getItem('userToken');

        axios.get('http://172.23.58.10/dhcp/dhcp/interfaces', { headers: {
            "Authorization": token
        }})
            .then(response => {
                setLoading(false);
                let array_ant;
                let array;

                if(response.data.data && Object.keys(response.data.data).length !== 0){
                    array_ant = response.data.data;
                    array_ant = array_ant.filter(item => item !== "lo" && item !== "tun0" && item !== "ens160");
                    array = array_ant.map(item => ({ value: item, label: item }))
                    setInterfaces(array);
                }
            })
            .catch(error => {
                setLoading(false);
                console.error(error.message);
                if(error.response.data.error == "Invalid token"){
                    localStorage.clear();
                }
                setMessage(error.message);
                timePopUp();
            });
    }

    const getInitConf = () => {
        setLoading(true);
        const token = localStorage.getItem('userToken');

        axios.get('http://172.23.58.10/dhcp/dhcp/initConf', { headers: {
            "Authorization": token
        }})
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

                    form.setFieldsValue({
                        interface: response.data.data.netInterface,
                        gateway: response.data.data.gateway,
                        subNet: response.data.data.subNet,
                        rangeInicial: response.data.data.rangeInicial,
                        rangeFinal: response.data.data.rangeFinal,
                        lease: response.data.data.lease,
                        primario: response.data.data.dnsPrimario,
                        secundario: response.data.data.dnsSecundario
                    });
                }
            })
            .catch(error => {
                setLoading(false);
                if(error.response.data.error == "Invalid token"){
                    localStorage.clear();
                }
                console.error(error.message);
                setMessage(error.message);
                timePopUp();
            });
    }

    const handleSubmit = () => {
        setLoading(true);
        const token = localStorage.getItem('userToken');

        const data = {
            netInterface: interfaceVal,
            gateway: gatewayVal,
            subNet: subNetVal,
            rangeInicial: rangeInicialVal,
            rangeFinal: rangeFinalVal,
            lease: leaseVal,
            dnsPrimario: primarioVal,
            dnsSecundario: secundarioVal,
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

        axios.post('http://172.23.58.10/dhcp/dhcp/conf', data, { headers: {
            "Authorization": token
        }})
            .then(response => {
                setLoading(false);
                setIsSuccess(true);
                setMessage(response.data.message);
                timePopUp();
            })
            .catch(error => {
                setLoading(false);
                console.error(error.message);
                if(error.response.data.error == "Invalid token"){
                    localStorage.clear();
                } else if(error.code == "ERR_BAD_REQUEST"){
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

    const style = {
        width: "100%"
    }

    return (
        <Fragment>
            {loading && <Loading />}
            {message && <Message message={message} isSuccess={isSuccess}/>}
            <Form
                form={form} 
                layout="vertical" 
                onFinish={handleSubmit}
                className="formulario"
                initialValues={{
                    interface: interfaceVal,
                    gateway: gatewayVal,
                    subNet: subNetVal,
                    rangeInicial: rangeInicialVal,
                    rangeFinal: rangeFinalVal,
                    lease: leaseVal,
                    primario: primarioVal,
                    secundario: secundarioVal
                }}
            >
                <Row>
                    <Col span={6}>
                        <Form.Item
                            name="interface"
                            label="Interface"
                        >
                            <Select
                                style={style}
                                onChange={e => setInterfaceVal(e.target.value)}
                                options={interfaces}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="gateway"
                            label="Gateway"
                        >
                            <Input 
                                style={style}
                                onChange={e => setGatewayVal(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="subNet"
                            label="Sub-Net"
                        >
                            <Input 
                                style={style}
                                onChange={e => setSubNetVal(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="rangeInicial"
                            label="Range Inicial"
                        >
                            <Input 
                                style={style}
                                onChange={e => setRangeInicialVal(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Form.Item
                            name="rangeFinal"
                            label="Range Final"
                        >
                            <Input 
                                style={style}
                                onChange={e => setRangeFinalVal(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="lease"
                            label="Lease"
                        >
                            <Input 
                                style={style}
                                onChange={e => setLeaseVal(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="primario"
                            label="DNS Primário"
                        >
                            <Input 
                                style={style}
                                onChange={e => setPrimarioVal(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="secundario"
                            label="DNS Secundário"
                        >
                            <Input 
                                style={style}
                                onChange={e => setSecundarioVal(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
    
                <div className="container-button">
                    <Button type="primary" onClick={() => {form.submit()}} >Configurar DHCP</Button>
                </div>
            </Form>
        </Fragment>

    )
}

export default Formulario;