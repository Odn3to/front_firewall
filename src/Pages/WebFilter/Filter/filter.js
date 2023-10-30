import React, { useState, useEffect } from "react";
import { Form, Input, Button, Switch, Radio, Row, Col, message, Modal } from 'antd';
import DataGrid from "../../../Componentes/DataGrid/Datagrid";
import ModalDelecao from "../../../Componentes/ModalDelecao/ModalDelecao";
import Loading from "../../../Componentes/Loading/Loading";
import axios from 'axios';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

function Filter() {

  const [data_source, setData_source] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  
  const [form] = Form.useForm();

  useEffect(() => {
    getSites();
  }, [])

  const getSites = () => {
    setLoading(true);

    if(searchValue != ''){
      axios.get(`http://172.23.58.10/webfilter/search/${searchValue}`)
      .then(response => {
        setLoading(false);
        setData_source(response.data.data);
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
    }else{
      axios.get(`http://172.23.58.10/webfilter/search`)
      .then(response => {
          setLoading(false);
          setData_source(response.data.data);
          message.success(response.data.message);
      })
      .catch(error => {
          setLoading(false);
          console.error(error.message);
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
  }
  
  const modalOpen = (data) => {
    if(data){
      setSelectData(data);
      setNameValue(data.nome);
      setUrlValue(data.url);
      form.setFieldsValue({
        name: data.nome,
        url: data.url,
      });
    }
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    cleanStates();
  }

  const confirmDelete = (data) => {
    setConfirmDeleteModal(true);
    setSelectData(data);
  };

  const closeDelete = () => {
    setConfirmDeleteModal(false);
    cleanStates();
  };

  const onOk = () => {
    form.submit();
  }

  const cleanStates = () =>{
    setSelectedRows([]);
    setSelectedRowKeys([]);
    setSelectData([]);
    setNameValue('');
    setUrlValue('');
    form.setFieldsValue({
      name: '',
      url: '',
    });
  }

  const onFinish = (values) => {
    setLoading(true);

    const data = {  
      nome: values.name,
      url: values.url
    };

    if(selectData.ID){
      axios.put(`http://172.23.58.10/webfilter/edit/${selectData.ID}`, data)
      .then(response => {
        closeModal();
        setLoading(false);
        getSites();
        cleanStates();
        message.success(response.data.message);
      })
      .catch(error => {
        setIsModalOpen(false);
        setLoading(false);
        getSites();
        cleanStates();
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
      return;
    }

    axios.post('http://172.23.58.10/webfilter/new', data)
      .then(response => {
        closeModal();
        setLoading(false);
        getSites();
        cleanStates();
        message.success(response.data.message);
      })
      .catch(error => {
        setIsModalOpen(false);
        setLoading(false);
        getSites();
        cleanStates();
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

  const deleteWebFilter = () => {
    setLoading(true);
    axios.delete(`http://172.23.58.10/webfilter/delete/${selectData.ID}`)
      .then(response => {
        closeDelete();
        setLoading(false);
        getSites();
        cleanStates();
        message.success(response.data.message);
      })
      .catch(error => {
        setIsModalOpen(false);
        setLoading(false);
        getSites();
        cleanStates();
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

  const renderActions = (data) => {
    return <div>
      <Button 
          type="primary" 
          icon={<EditOutlined />} 
          style={{ marginLeft: '10px' }}
          onClick={() => modalOpen(data)}
        />
      <Button 
          type="primary" 
          icon={<DeleteOutlined />} 
          style={{ marginLeft: '10px' }}
          onClick={() => confirmDelete(data)}
        />
    </div>;
  }

  const colunas = [
    { title: "Nome", dataIndex: "nome", width: 200, align: "center" },
    { title: "Site", dataIndex: "url" , align: "center"},
    { title: "Ações", render: renderActions , width: 150, align: "center"},
  ]

  const onSelectChange = (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      {loading && <Loading />}
      <ModalDelecao openModal={confirmDeleteModal} onOk={deleteWebFilter} onCancel={closeDelete} selection={selectData} />
      <Modal
        title={"Bloqueio de Sites"}
        open={isModalOpen}
        width="700px" 
        onOk={onOk}
        onCancel={closeModal}
        bodyStyle={{ height: '80px' }}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          initialValues={{
            name: nameValue,
            url: urlValue,
          }}
        >
          <Row gutter={16} >
            <Col span={8}>
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
                <Input size="middle" style={{ width: '200px' }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item 
                label="URL"
                name="url"
                rules={[
                  {
                    required: true,
                    message: 'Por favor insira o site a ser bloqueado!',
                  }
                ]}  
              >
                <Input size="middle" style={{ width: '300px' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>


      <DataGrid 
          rowSelection={rowSelection} 
          colunas={colunas} 
          data={data_source} 
          onclick_plus={modalOpen} 
          filterFormOnSubmit={getSites}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
    </div>
  );
}

export default Filter;