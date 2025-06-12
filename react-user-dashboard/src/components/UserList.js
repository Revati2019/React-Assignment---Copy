import { Row, Col } from 'antd';
import UserCard from './UserCard';

const UserList = ({ users, onEdit, onDelete, onView }) => {
  return (
    <Row gutter={[16, 16]}>
      {users.map((user) => (
        <Col key={user.id} xs={24} sm={12} md={8} lg={6}>
          <UserCard user={user} onEdit={onEdit} onDelete={onDelete} onView={onView} />
        </Col>
      ))}
    </Row>
  );
};

export default UserList;
