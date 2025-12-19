import { render, screen } from '@testing-library/react';
import Login from './Login';

describe('Login Page', () => {

  test('renders email input', () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput).toBeInTheDocument();
  });

  test('renders password input', () => {
    render(<Login />);
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toBeInTheDocument();
  });

  test('renders login button', () => {
    render(<Login />);
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeInTheDocument();
  });

});
