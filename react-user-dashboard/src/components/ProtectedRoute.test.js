
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
import * as redux from 'react-redux';
import * as router from 'react-router-dom';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Navigate: jest.fn(({ to, replace, state }) => (
    <div data-testid="navigate-redirect" data-to={to} data-replace={replace.toString()} data-state={JSON.stringify(state)}>
      Redirected
    </div>
  )),
  useLocation: jest.fn(),
}));

const DummyComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  let useSelectorMock;
  let useLocationMock;

  beforeEach(() => {
    useSelectorMock = jest.spyOn(redux, 'useSelector');
    useLocationMock = jest.spyOn(router, 'useLocation');
    
    // Clear localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to "/" with authError and from state if no token in redux or localStorage', () => {
    useSelectorMock.mockReturnValue(null);
    useLocationMock.mockReturnValue({ pathname: '/protected' });
    window.localStorage.getItem.mockReturnValue(null);

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

  it('renders component when token exists in localStorage', () => {
    useSelectorMock.mockReturnValue(null);
    useLocationMock.mockReturnValue({ pathname: '/protected' });
    window.localStorage.getItem.mockReturnValue('local-token');

    render(<ProtectedRoute component={DummyComponent} />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
