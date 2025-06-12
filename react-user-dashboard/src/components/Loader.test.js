import React from 'react';
import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders the loader container', () => {
    const { container } = render(<Loader />);
    const loaderElement = container.querySelector('.loader-container');
    expect(loaderElement).toBeInTheDocument();
  });
});
