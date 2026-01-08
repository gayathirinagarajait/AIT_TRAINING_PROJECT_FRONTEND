import ForgotPassword from './ForgotPassword';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';

const theme = createTheme();

describe('ForgotPassword UI', () => {
  beforeEach(() => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      </ThemeProvider>
    );
  });

  it('should render forgot password form UI', () => {
    cy.contains('Reset Your Password').should('be.visible');
    cy.contains("Enter your email address").should('be.visible');

    cy.get('input[name="email"]').should('exist');
    cy.contains('Send OTP').should('exist');
    cy.contains('Sign In').should('exist');
  });
});
