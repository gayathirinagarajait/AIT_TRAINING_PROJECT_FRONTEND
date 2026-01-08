import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';

describe('Register Page', () => {

  const setup = () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  it('should render Full Name field', () => {
    setup();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it('should render Email Address field', () => {
    setup();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('should render Password field', () => {
    setup();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should render Role dropdown', () => {
    setup();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });

  it('should render Create Account button', () => {
    setup();
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument();
  });

});
