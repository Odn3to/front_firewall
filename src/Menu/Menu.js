import React from "react";
import './Menu.css';
import { useLocation, useNavigate } from "react-router-dom";
import { AppstoreOutlined, CloudServerOutlined , FilterOutlined, LogoutOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('DHCP', 'dhcp', <CloudServerOutlined  />),
  getItem('Firewall', 'firewall', <AppstoreOutlined />),
  getItem('WebFilter', 'webFilter', <FilterOutlined />),
  getItem('Sair', 'sair', <LogoutOutlined />),
];

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const routeToSelect = {
    '/': 'dhcp',
    '/firewall': 'firewall',
    '/webFilter': 'webFilter'
  };

  const select = routeToSelect[location.pathname] || 'dhcp';

  const onClick = (item) => {
    switch (item.key) {
      case 'dhcp':
        navigate('/');
        break;
      case 'firewall':
        navigate('/firewall');
        break;
      case 'webFilter':
        navigate('/webFilter');
        break;
      case 'sair':
        localStorage.clear();
        navigate('/login');
        break;
      default:
        break;
    }
  }

  return (
    <Menu
        className="full-height-menu"
        theme={'dark'}
        onClick={(item) => onClick(item)}
        style={{
          width: 200,
        }}
        selectedKeys={[select]}
        mode="inline"
        items={items}
      />
  );
}

export default SideBar;
