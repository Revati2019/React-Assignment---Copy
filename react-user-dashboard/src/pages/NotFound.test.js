import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotFound from './NotFound';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('NotFound Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders 404 title and subtitle', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/sorry, the page you visited does not exist/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back home/i })).toBeInTheDocument();
  });

  it('navigates to home on button click', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /back home/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
