import React, { useState, useRef, useEffect  } from "react";
import DataGrid from "../../../Componentes/DataGrid/Datagrid";
import Loading from "../../../Componentes/Loading/Loading";
import ModalDelecao from "../../../Componentes/ModalDelecao/ModalDelecao";
import axios from 'axios';
import ModalRegras from "./ModalRegras/ModalRegras"
import {Button, Modal, message} from 'antd';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './Regras.css';


function Regras() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [data_source, setData_source] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  
  useEffect(() => {
    getRegras();
  }, [])

  const formRef = useRef();

  const handleModalOk = () => {
    formRef.current.submit();
  };


  const openModal = (data) => {
    if(data.id){
      setSelectData(data);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    cleanStates();
  };

  const confirmDelete = (data) => {
    setConfirmDeleteModal(true);
    setSelectData(data);
  };

  const closeDelete = () => {
    setConfirmDeleteModal(false);
    cleanStates();
  };

  const cleanStates = () =>{
    setSelectedRows([]);
    setSelectedRowKeys([]);
    setSelectData([]);
  }

  const getRegras = () => {
    setLoading(true);

    axios.get(`http://172.23.58.10/api/regras/${searchValue}`)
      .then(response => {
          setLoading(false);
          setData_source(response.data.data);
          message.success(response.data.message);
      })
      .catch(error => {
          setIsModalOpen(false);
          setLoading(false);
          console.error(error.message);
          if(error.code == "ERR_BAD_REQUEST"){
              message.error(error.response.data.error);
          }else{
              message.error(error.message);
          }
      }); 
  }


  const onFinish = (values) => {
    setLoading(true);
    
    const data = {
      nome: values.name,
      acao: values.action,
      origem: values.origem,
    };
    
    if (values.nat) {
      data.nat = values.nat;
    }

    if (values.destino) {
      data.destino = values.destino;
    }

    if(values.protocolo_origem){
      data.protocolo_origem = values.protocolo_origem;
    }

    if(values.protocolo_destino){
      data.protocolo_destino = values.protocolo_destino;
    }

    if(values.porta_destino){
      data.porta_destino = values.porta_destino;
    }

    if(values.porta_origem){
      data.porta_origem = values.porta_origem;
    }

    if(selectData.id){
      axios.put(`http://172.23.58.10/api/regra/${selectData.id}`, data)
      .then(response => {
          setIsModalOpen(false);
          setLoading(false);
          getRegras();
          cleanStates();
          message.success(response.data.message);
      })
      .catch(error => {
          setIsModalOpen(false);
          setLoading(false);
          getRegras();
          cleanStates();
          console.error(error.message);
          if(error.code == "ERR_BAD_REQUEST"){
              message.error(error.response.data.error);
          }else{
              message.error(error.message);
          }
      });

      return;
    }

    axios.post('http://172.23.58.10/api/newregra', data)
      .then(response => {
          setIsModalOpen(false);
          setLoading(false);
          getRegras();
          cleanStates();
          message.success(response.data.message);
      })
      .catch(error => {
          setIsModalOpen(false);
          setLoading(false);
          getRegras();
          cleanStates();
          console.error(error.message);
          if(error.code == "ERR_BAD_REQUEST"){
              message.error(error.response.data.error);
          }else{
              message.error(error.message);
          }
      }); 
  } 

  const deleteRegras = () => {
    setLoading(true);

    axios.delete(`http://172.23.58.10/api/regra/${selectData.id}`)
      .then(response => {
          closeDelete();
          getRegras();
          setLoading(false);
          message.success(response.data.message);
      })
      .catch(error => {
          closeDelete();
          setLoading(false);
          console.error(error.message);
          if(error.code == "ERR_BAD_REQUEST"){
              message.error(error.response.data.error);
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
          onClick={() => openModal(data)}
        />
      <Button 
          type="primary" 
          icon={<DeleteOutlined />} 
          style={{ marginLeft: '10px' }}
          onClick={() => confirmDelete(data)}
        />
    </div>;
  }

  const renderIp = (text, record, tipo) => {

    let origem = record.origem ? `${record.origem}` : '';
    let porta = record.porta_origem ? ` : ${record.porta_origem}` : '';
    let protocolo = record.protocolo_origem ? ` ${record.protocolo_origem}` : '';

    if(tipo == 'destino'){
      origem = record.destino ? `${record.destino}` : '';
      porta = record.porta_destino ? ` : ${record.porta_destino}` : '';
      protocolo = record.protocolo_destino ? ` ${record.protocolo_destino}` : '';
    }

    return (
      `${origem} ${porta} ${protocolo}`
    )
  }


  const colunas = [
    { title: "Nome", dataIndex: "nome", align: "center" },
    { title: "Regra", dataIndex: "acao" , width: 200, align: "center"},
    { title: "Origem", dataIndex: "origem", align: "center", render: (text, record) => renderIp(text, record, 'origem')},
    { title: "Destino", dataIndex: "destino", align: "center", render: (text, record) => renderIp(text, record, 'destino') },
    { title: "NAT", align: "center", dataIndex: "nat" },
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

  const titleModalRegra = selectData.id ? "Editar Regra": "Adicionar Regra";

  return (
    <div>
      {loading && <Loading />}
      <ModalDelecao openModal={confirmDeleteModal} onOk={deleteRegras} onCancel={closeDelete} selection={selectData} />
        <Modal
        title={titleModalRegra}
        open={isModalOpen}
        width="50%" 
        onOk={handleModalOk}
        onCancel={closeModal}
        bodyStyle={{ height: '300px' }}
      >
        <ModalRegras formRef={formRef} onFinish={onFinish} data={selectData}/>
      </Modal>
        <DataGrid 
          rowSelection={rowSelection} 
          colunas={colunas} 
          data={data_source} 
          onclick_plus={openModal} 
          filterFormOnSubmit={getRegras}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
    </div>
  );
}

export default Regras;