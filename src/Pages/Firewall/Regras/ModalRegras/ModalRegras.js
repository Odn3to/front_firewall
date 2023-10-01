import React, { useEffect } from "react";
import  "./ModalRegras.css";
import { Form, Input, Tabs, Radio, Row, Col, Select } from 'antd';
const { TabPane } = Tabs;

function ModalRegras({onFinish, formRef, data}) {

  const [form] = Form.useForm();

  useEffect(() => {
      if (formRef) {
          formRef.current = form;
      }
      form.setFieldsValue({
        name: data ? data.nome : '',
        action: data ? data.acao : '',
        origem: data ? data.origem : '',
        destino: data ? data.destino : '',
        nat: data ? data.nat : '',
        protocolo_origem: data ? data.protocolo_origem : '',
        protocolo_destino: data ? data.protocolo_destino : '',
        porta_destino: data ? data.porta_destino : '',
        porta_origem: data ? data.porta_origem : '',
    });
  }, [form, formRef, data]);
     
  return (
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={onFinish}
      initialValues={{
        name: data ? data.nome : '',
        action: data ? data.acao : '',
        origem: data ? data.origem : '',
        destino: data ? data.destino : '',
        nat: data ? data.nat : '',
        protocolo_origem: data ? data.protocolo_origem : '',
        protocolo_destino: data ? data.protocolo_destino : '',
        porta_destino: data ? data.porta_destino : '',
        porta_origem: data ? data.porta_origem : '',
      }}
      >
      <Tabs defaultActiveKey="1" tabPosition="left">
        <TabPane tab="Propriedades" key="1">

              <Form.Item 
                label="Nome"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Por favor insira seu nome!',
                  },
                  {
                    pattern: /^[A-Za-z0-9 ]*$/,
                    message: 'Caracteres especiais não são permitidos!',
                  },
                ]}  
              >
                  <Input size="middle" style={{ width: '300px' }} />
              </Form.Item>
              <Form.Item 
                label="Ação"
                name="action"
                rules={[
                  {
                    required: true,
                    message: 'Por favor insira a Ação!',
                  },
                ]}  
              >
                <Radio.Group name="acao">
                  <Radio value="Permitir">Permitir</Radio>
                  <Radio value="Bloquear">Bloquear</Radio>
                </Radio.Group>
              </Form.Item>
        </TabPane>
        <TabPane tab="Conexão" key="2">
          <Row gutter={8}>
            <Col span={8}>
                <Form.Item 
                    label="Origem"
                    name="origem"
                >
                    <Input size="middle" />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item 
                    label="Protocolo"
                    name="protocolo_origem"
                    rules={[
                        {
                            pattern: /^[A-Za-z0-9 ]*$/,
                            message: 'Caracteres especiais não são permitidos!',
                        },
                    ]}  
                >
                    <Input size="middle" />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item 
                    label="Porta"
                    name="porta_origem"
                    rules={[
                        {
                            pattern: /^[A-Za-z0-9 ]*$/,
                            message: 'Caracteres especiais não são permitidos!',
                        },
                    ]}  
                >
                    <Input size="middle" />
                </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item 
                label="Destino"
                name="destino"
              >
                  <Input size="middle" />
              </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item 
                    label="Protocolo"
                    name="protocolo_destino"
                    rules={[
                        {
                            pattern: /^[A-Za-z0-9 ]*$/,
                            message: 'Caracteres especiais não são permitidos!',
                        },
                    ]}  
                >
                    <Input size="middle" />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item 
                    label="Porta"
                    name="porta_destino"
                    rules={[
                        {
                            pattern: /^[A-Za-z0-9 ]*$/,
                            message: 'Caracteres especiais não são permitidos!',
                        },
                    ]}  
                >
                    <Input size="middle" />
                </Form.Item>
            </Col>
          </Row>
          </TabPane>
        <TabPane tab="Roteamento" key="3">
          <Form.Item 
              label="NAT"
              name="nat"
              rules={[
                {
                  pattern: /^[A-Za-z0-9 ]*$/,
                  message: 'Caracteres especiais não são permitidos!',
                },
              ]}  
            >
              <Select
                defaultValue=""
                style={{
                  width: 300,
                }}
                options={[
                  {
                    value: '',
                    label: '',
                  },
                  {
                    value: 'MASQUERADE',
                    label: 'MASQUERADE',
                  },
                  {
                    value: 'Forward',
                    label: 'Forward',
                  },
                ]}
              />
            </Form.Item>
        </TabPane>
      </Tabs>
    </Form>
    
  );
}

export default ModalRegras;