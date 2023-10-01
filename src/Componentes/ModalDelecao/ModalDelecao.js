import React, {Fragment} from "react";

import { Modal } from 'antd';


function ModalDelecao({openModal, onOk, onCancel, selection}) {

  const id = selection.id ? selection.id : selection.ID

  return (
    <Fragment>
      <Modal
        title="Deletar Regra's"
        open={openModal}
        width="400px" 
        onOk={onOk}
        onCancel={onCancel}
        bodyStyle={{ height: '100px' }}
      >
        <p>Tem certeza que deseja deletar a Regra:</p>
        <ul>
            <li key={id}>id: {id} - {selection.nome}</li>
        </ul>
      </Modal>
    </Fragment>
  );
}

export default ModalDelecao;