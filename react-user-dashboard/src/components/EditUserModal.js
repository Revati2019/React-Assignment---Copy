import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const EditUserModal = ({ visible, user, onSave, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        onSave({ ...user, ...values });
        form.resetFields();
      })
      .catch(info => {
        console.error('Validation Failed:', info);
      });
  };

  return (
    <Modal
      title="Edit User"
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      oktext="Save"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: 'Name is required' },
            { type: 'string', message: 'Name must be a string' },
            { min: 3, message: 'Name must be at least 3 characters' },
            { max: 50, message: 'Name must be at most 50 characters' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Email is not valid' },
            { max: 100, message: 'Email must be at most 100 characters' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { type: 'string', message: 'Phone must be a string' },
            { min: 7, message: 'Phone must be at least 7 digits' },
           
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['address', 'city']}
          label="City"
          rules={[
            { type: 'string', message: 'City must be a string' },
            {
              pattern: /^[A-Za-z\s]+$/,
              message: 'City must contain characters only',
            },
            { max: 50, message: 'City must be at most 50 characters' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="website"
          label="Website"
          rules={[
            { type: 'string', message: 'Website must be a string' },
            {
              pattern: /^[A-Za-z\s]+$/,
              message: 'website must contain characters only',
            },
            { max: 100, message: 'Website must be at most 100 characters' },
          ]}
        >
          <Input />
        </Form.Item>

      <Form.Item
          name={['company', 'name']}
          label="Company"
          rules={[
            {
              required: true,
              message: 'Company name is required',
            },
            {
              max: 100,
              message: 'Company must be at most 100 characters',
            },
          ]}
        >
          <Input />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default EditUserModal;
