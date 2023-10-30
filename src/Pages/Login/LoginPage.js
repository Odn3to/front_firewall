import React, { useState } from 'react';
import { Button, Form, Input, Layout, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import axios from "axios";

const { Header, Content } = Layout;
const { Title } = Typography;

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    axios.post('http://172.23.58.10/auth/login/token', formData)
      .then(response => {
        const token = response.data.token;
        localStorage.setItem('userToken', token);
        navigate('/');
      })
      .catch(error => {
          console.error(error);
      });
  };

  return (
    <Layout className="login-layout">
        <Content className="login-content">
          <div className="avatar">
            <UserOutlined className="avatar-icon" />
          </div>
        <Form
          onFinish={handleSubmit}
          className="login-form"
        >
          <Title 
            level={3} 
            style={{ 
              color: 'white',
              marginBottom: '30px' }}
            >Acesse sua conta</Title>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Username é obrigatório!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password é obrigatório!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}

export default LoginPage;