import React from 'react';
import { render, screen } from '@testing-library/react';
import UserDetail from './UserDetail';

jest.mock('antd', () => {
  const Descriptions = ({ children }) => <div>{children}</div>;
  Descriptions.Item = ({ label, children }) => (
    <div>
      <strong>{label}:</strong> {children}
    </div>
  );

  return {
    Avatar: ({ src }) => <img alt="avatar" src={src} />,
    Descriptions,
  };
});

const mockUser = {
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  phone: '1234567890',
  website: 'johndoe.dev',
  company: { name: 'Example Inc.' },
  address: { street: '123 Main St', city: 'New York' },
};

describe('UserDetail', () => {
  it('renders nothing when user is not provided', () => {
    const { container } = render(<UserDetail user={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('displays user information when user is provided', () => {
    render(<UserDetail user={mockUser} />);

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/1234567890/i)).toBeInTheDocument();
    expect(screen.getByText(/johndoe.dev/i)).toBeInTheDocument();
    expect(screen.getByText(/example inc/i)).toBeInTheDocument();
    expect(screen.getByText(/123 main st, new york/i)).toBeInTheDocument();
  });
});
