import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import { Card, Button } from 'antd';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <Loader />;

  if (!user) return <p>User not found.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
    <Button
    onClick={() => navigate('/dashboard')}
      style={{
        marginBottom: 20,
        backgroundColor: '#2F8D87',
        color: 'white',
        borderColor: '#2F8D87'
        }}
      >
      Back to Dashboard
    </Button>

      <Card
        title={`${user.firstName} ${user.lastName}`}
        style={{ width: 400 }}
        cover={<img alt={user.username} src={user.image} />}
      >
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Username:</strong> {user.username}</p>
      </Card>
    </div>
  );
};

export default UserProfile;
