import ResetPassword from './ResetPassword';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';

const theme = createTheme();

describe('ResetPassword UI', () => {
  beforeEach(() => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/reset-password',
              state: { email: 'test@example.com' },
            },
          ]}
        >
          <ResetPassword />
        </MemoryRouter>
      </ThemeProvider>
    );
  });

  it('should render reset password form', () => {
    cy.contains('Set New Password').should('be.visible');
    cy.get('[data-cy="email"]').should('exist');
    cy.get('[data-cy="otp"]').should('exist');
    cy.get('[data-cy="newPassword"]').should('exist');
    cy.get('[data-cy="ConfirmPassword"]').should('exist');
    cy.contains('Reset Password').should('exist');
  });

  it('should show validation errors on empty submit', () => {
    cy.contains('Reset Password').click();
    
    cy.contains('OTP is required').should('be.visible');
    cy.contains('New password is required').should('be.visible');
    cy.contains('Please confirm your password').should('be.visible');
  });

  it('should show error for invalid OTP', () => {
    cy.get('[data-cy="otp"]').type('123');
    cy.contains('Reset Password').click();
    cy.contains('OTP must be 6 digits').should('be.visible');
  });

  it('should show password mismatch error', () => {
    cy.get('[data-cy="otp"]').type('123456');
    cy.get('[data-cy="newPassword"]').type('password123');
    cy.get('[data-cy="ConfirmPassword"]').type('password456');
    
    cy.contains('Reset Password').click();
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('should clear errors on input change', () => {
    // Trigger validation first
    cy.contains('Reset Password').click();
    cy.contains('OTP is required').should('be.visible');
    
    // Type in fields - errors should clear
    cy.get('[data-cy="otp"]').type('123456');
    cy.get('[data-cy="otp"]').should('not.have.class', 'Mui-error');
    
    cy.get('[data-cy="newPassword"]').type('password123');
    cy.get('[data-cy="newPassword"]').should('not.have.class', 'Mui-error');
  });

  it('should handle Enter key submission', () => {
    cy.get('[data-cy="otp"]').type('123456{enter}');
    cy.contains('OTP is required').should('not.exist'); // Still validates
  });
});
