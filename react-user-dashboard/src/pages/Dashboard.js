import React, { useEffect, useState } from 'react';
import { Row, Col, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import UserCard from '../components/UserCard';
import EditUserModal from '../components/EditUserModal';
import Loader from '../components/Loader';
import api from '../utils/api';
import useAuthToken from '../hooks/useAuthToken';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { clearAuth } = useAuthToken();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users');

        await new Promise(resolve => setTimeout(resolve, 2000)); 
        setUsers(response.data.users);
      } catch (error) {
        message.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSave = (updatedUser) => {
    setUsers(prev =>
      prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
    );
    setEditingUser(null);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      setUsers(prev => prev.filter(user => user.id !== id));
      alert('User deleted successfully.');
    }
  };

  const handleLogout = () => {
    clearAuth(); 
    navigate('/', { replace: true }); 
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{ padding: 20, textAlign: 'right' }}>
        <Button onClick={handleLogout} type="primary" danger>
          Logout
        </Button>
      </div>

      <Row gutter={[16, 16]} justify="center">
        {users.map(user => (
          <Col key={user.id}>
            <UserCard
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Col>
        ))}
      </Row>

      <EditUserModal
        visible={!!editingUser}
        user={editingUser}
        onSave={handleSave}
        onCancel={() => setEditingUser(null)}
      />
    </div>
  );
};

export default Dashboard;
