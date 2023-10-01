import React, { useState, useEffect } from "react";
import './proxy.css';
import { Form, Input, Button, Switch, Radio, Row, Col, message } from 'antd';
import AlertBalloon from '../../DHCP/AlertStatus/AlertBallon.js'
import axios from 'axios';
import {regexIpv4} from '../../../utils/utils.js'
import { SaveOutlined } from '@ant-design/icons';

function Proxy() { 

  const [proxyType, setProxyType] = useState('Transparente'); 
  const [proxyIP, setProxyIP] = useState('');
  const [status, setStatus] = useState({ text: 'ATIVADO', class: 'alert-green' });
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    getConfig();
    getStatus();
  }, []);


  const save = () => {
    form.submit();
  }

const onFinish = (values) => {
  const data = {
    tipo: values.proxy_type,
    ip: values.ip ? values.ip : ''
  };

  setLoading(true);
  axios.post('http://172.23.58.10/api/proxy/config', data)
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



  const getConfig = () => {
    axios.get('http://172.23.58.10/api/proxy/get')
      .then(response => {
       const { tipo, ipProxy } = response.data.data;
       setProxyType(tipo);
       setProxyIP(ipProxy);
       // Use setFieldsValue to update form fields with API data
       form.setFieldsValue({
         proxy_type: tipo,
         ip: ipProxy
       });
      })
      .catch(error => {
          console.error(error.message);
          if(error.code == "ERR_BAD_REQUEST"){
              message.error(error.response.data.error);
          }else{
              message.error(error.message);
          }
      });
  }

  const getStatus = () => {
    axios.get('http://172.23.58.10/api/proxy/status')
      .then(response => {
        setStatus(response.data.status);
      })
      .catch(error => {
          console.error(error.message);
          if(error.code == "ERR_BAD_REQUEST"){
              message.error(error.response.data.error);
          }else{
              message.error(error.message);
          }
      });
  }

  return (
    <Form 
      form={form}
      layout="vertical" 
      onFinish={onFinish}
      initialValues={{
        proxy_type: proxyType,
        ip: proxyIP
      }}
      style={{ maxWidth: '100%', overflowX: 'hidden' }}
      >
        <Row gutter={16}>
            <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
                <Form.Item 
                  label="Tipo de Proxy" 
                  name="proxy_type"
                >
                  <Radio.Group onChange={(e) => setProxyType(e.target.value)}>
                    <Radio value="Explícito"> Explícito </Radio>
                    <Radio value="Transparente"> Transparente </Radio>
                  </Radio.Group>
                </Form.Item>
            </Col>
            <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <AlertBalloon status={status}/>
            </Col>
        </Row>
        { proxyType == 'Explícito' &&
          <Row gutter={16}>
              <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
              <Form.Item 
                  label="IP proxy explícito"
                  name="ip"
                  rules={[
                    {
                      pattern: regexIpv4(),
                      message: 'Por favor, insira um endereço IPv4 válido!',
                    },
                  ]}
                >
                    <Input size="middle" style={{ width: '300px' }} onChange={(e) => setProxyIP(e.target.value)} />
                </Form.Item>
              </Col>
          </Row>
        }
        <Row gutter={16}>
          <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={save} 
            >
              Salvar
            </Button>
          </Col>
        </Row>
    </Form>
  );
}

export default Proxy;