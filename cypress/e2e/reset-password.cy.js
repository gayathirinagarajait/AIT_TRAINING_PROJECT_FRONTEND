describe('Reset Password Page', () => {
  beforeEach(() => {
    cy.visit('/reset-password', {
      state: { email: 'test@example.com' },
    });
  });

  /* =========================
     RENDER TEST
  ========================== */

  it('should render reset password form', () => {
    cy.contains('Set New Password').should('be.visible');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="otp"]').should('exist');
    cy.get('input[name="newPassword"]').should('exist');
    cy.get('input[name="confirmPassword"]').should('exist');
    cy.contains('Reset Password').should('be.visible');
  });

  /* =========================
     VALIDATION TESTS
  ========================== */

  it('should show validation errors on empty submit', () => {
    cy.contains('Reset Password').click();

    cy.contains('Email is required').should('be.visible');
    cy.contains('OTP is required').should('be.visible');
    cy.contains('New password is required').should('be.visible');
    cy.contains('Please confirm your password').should('be.visible');
  });

  it('should show error for invalid OTP length', () => {
    cy.get('input[name="otp"]').type('123');
    cy.contains('Reset Password').click();

    cy.contains('OTP must be 6 digits').should('be.visible');
  });

  it('should show error when passwords do not match', () => {
    cy.get('input[name="email"]').clear().type('test@example.com');
    cy.get('input[name="otp"]').type('123456');
    cy.get('input[name="newPassword"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password456');

    cy.contains('Reset Password').click();

    cy.contains('Passwords do not match').should('be.visible');
  });

  /* =========================
     SUCCESS CASE (API MOCK)
  ========================== */

  it('should reset password successfully', () => {
    cy.intercept('POST', '**/reset-password', {
      statusCode: 200,
      body: { message: 'Password reset successful' },
    }).as('resetPassword');

    cy.get('input[name="email"]').clear().type('test@example.com');
    cy.get('input[name="otp"]').type('123456');
    cy.get('input[name="newPassword"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');

    cy.contains('Reset Password').click();

    cy.wait('@resetPassword');

    cy.contains('Password reset successful!').should('be.visible');
  });

  /* =========================
     ENTER KEY SUBMIT
  ========================== */

  it('should submit form on Enter key press', () => {
    cy.intercept('POST', '**/reset-password', {
      statusCode: 200,
      body: { message: 'Password reset successful' },
    }).as('resetPassword');

    cy.get('input[name="email"]').clear().type('test@example.com');
    cy.get('input[name="otp"]').type('123456');
    cy.get('input[name="newPassword"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123{enter}');

    cy.wait('@resetPassword');
    cy.contains('Password reset successful!').should('be.visible');
  });
});
