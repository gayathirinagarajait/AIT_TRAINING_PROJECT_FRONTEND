it("registers user successfully and redirects to login page", () => {
  cy.intercept("POST", "/api/auth/register", {
    statusCode: 201,
    body: { message: "Registration successful" }
  }).as("registerRequest");

  cy.visit("/register");

  cy.get('[data-testid="name"]').type("John Doe");
  cy.get('[data-testid="email"]').type("john@test.com");
  cy.get('[data-testid="password"]').type("Password@123");
  cy.get('[data-testid="register-btn"]').click();

  // wait for API
  cy.wait("@registerRequest");

  // assert redirect to login page (/)
  cy.url().should("eq", Cypress.config().baseUrl + "/");

  // assert login page rendered
  cy.get('[data-testid="login-title"]').should("be.visible");
});
