import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Alert } from 'antd';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/AuthSlice';
import './LoginPage.css';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

   useEffect(() => {
    if (location.state?.authError) {
      setErrorMsg('Please login');

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const { username, password } = values;

      const response = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password,
      });

      const token = response.data.token || response.data.accessToken;

      if (token) {
        dispatch(loginSuccess(token));
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        setErrorMsg('Invalid login credentials.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setErrorMsg(error.response.data.message || 'Invalid username or password');
        } else {
          setErrorMsg(`Login failed: ${error.response.statusText}`);
        }
      } else if (error.request) {
        setErrorMsg('No response from server. Please try again later.');
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">User Dashboard Login</div>

        {errorMsg && (
          <Alert
            message="Login Error"
            description={errorMsg}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="login-button"
              block
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
