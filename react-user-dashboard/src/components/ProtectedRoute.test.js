import React from 'react';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
import * as redux from 'react-redux';
import * as router from 'react-router-dom';

const DummyComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  let useSelectorMock;
  let useLocationMock;
  let navigateMock;

  beforeEach(() => {
    useSelectorMock = jest.spyOn(redux, 'useSelector');
    useLocationMock = jest.spyOn(router, 'useLocation');
    navigateMock = jest.spyOn(router, 'Navigate').mockImplementation(({ to, replace, state }) => {
      return (
        <div data-testid="navigate-redirect" data-to={to} data-replace={replace} data-state={JSON.stringify(state)}>
          Redirected
        </div>
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to "/" with authError and from state if no token in redux or localStorage', () => {
    useSelectorMock.mockReturnValue(null);
    useLocationMock.mockReturnValue({ pathname: '/protected' });

    render(<ProtectedRoute component={DummyComponent} />);

    const redirect = screen.getByTestId('navigate-redirect');

    expect(redirect).toBeInTheDocument();
    expect(redirect).toHaveAttribute('data-to', '/');
    expect(redirect).toHaveAttribute('data-replace', 'true');

    const state = JSON.parse(redirect.getAttribute('data-state'));
    expect(state).toEqual({ authError: true, from: '/protected' });
  });

  it('renders component when token exists in redux', () => {
    useSelectorMock.mockReturnValue('valid-token');
    useLocationMock.mockReturnValue({ pathname: '/protected' });

    render(<ProtectedRoute component={DummyComponent} />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders component when token exists in localStorage but not redux', () => {
    useSelectorMock.mockReturnValue(null);
    useLocationMock.mockReturnValue({ pathname: '/protected' });

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('local-storage-token');

    render(<ProtectedRoute component={DummyComponent} />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();

    Storage.prototype.getItem.mockRestore();
  });
});
