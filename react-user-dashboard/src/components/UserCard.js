import { Card, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const UserCard = ({ user, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/user/${user.id}`);
  };

  const addressParts = [];
  if (user.address?.street) addressParts.push(user.address.street);
  if (user.address?.city) addressParts.push(user.address.city);
  const address = addressParts.join(', ') || 'N/A';

  return (
    <Card
      style={{ width: 300, margin: 10, cursor: 'pointer' }}
      onClick={handleCardClick}
      actions={[
        <EditOutlined
          key="edit"
          onClick={(e) => {
            e.stopPropagation(); 
            onEdit(user);
          }}
        />,
        <DeleteOutlined
          key="delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(user.id);
          }}
        />
      ]}
    >
      <Meta
        avatar={
          <Avatar src={`https://avatars.dicebear.com/v2/avataaars/${user.username}.svg?options[mood][]=happy`} />
        }
        title={user.name}
        description={
          <>
            <div><b>Email:</b> {user.email}</div>
            <div><b>Phone:</b> {user.phone}</div>
            <div><b>Address:</b> {address}</div>
            <div><b>Company:</b> {user.company?.name || 'N/A'}</div>
          </>
        }
      />
    </Card>
  );
};

export default UserCard;
