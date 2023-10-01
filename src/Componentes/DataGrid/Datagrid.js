import React, { useState, useEffect } from "react";
import './datagrid.css';

import { Table, Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

function DataGrid({colunas, data, onclick_plus, filterFormOnSubmit, rowSelection, searchValue, setSearchValue}) { 

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <Input 
          placeholder="Search pelo nome..." 
          value={searchValue} 
          onChange={e => setSearchValue(e.target.value)} 
        />
        <Button 
          type="primary" 
          icon={<SearchOutlined />} 
          style={{ marginLeft: '10px' }}
          onClick={filterFormOnSubmit}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          style={{ marginLeft: '10px' }}
          onClick={onclick_plus}
        />
      </div>
      <Table  rowKey="id" rowSelection={rowSelection} dataSource={data} columns={colunas} pagination={{ position: ['bottomCenter'] }}/>
    </div>
  );
}

export default DataGrid;