import { Descriptions, Avatar } from 'antd';

const UserDetail = ({ user }) => {
  if (!user) return null;

  const avatarUrl = `https://avatars.dicebear.com/v2/avataaars/${user.username}.svg?options[mood][]=happy`;

  return (
    <div style={{ marginTop: '1rem' }}>
      <Avatar size={64} src={avatarUrl} />
      <Descriptions title="User Info" bordered column={1} style={{ marginTop: '1rem' }}>
        <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Website">{user.website}</Descriptions.Item>
        <Descriptions.Item label="Company">{user.company?.name}</Descriptions.Item>
        <Descriptions.Item label="Address">{`${user.address?.street}, ${user.address?.city}`}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default UserDetail;
