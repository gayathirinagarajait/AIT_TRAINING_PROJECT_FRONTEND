describe("Registration Page", () => {
  it("registers user successfully and redirects to login page", () => {
    cy.clearLocalStorage();

    cy.intercept("POST", "**/api/auth/register", {
      statusCode: 201,
      body: { message: "Registration successful" },
    }).as("registerRequest");

    cy.visit("/register");

    // Target the actual input elements inside MUI TextFields using data-testid
    cy.get('[data-testid="name"]').should("be.visible").clear().type("John Doe");
    cy.get('[data-testid="email"]').clear().type("john@test.com");
    cy.get('[data-testid="password"]').clear().type("Password@123");

    // Click submit button
    cy.get('[data-testid="register-btn"]').click();

    // Wait for API call
    cy.wait("@registerRequest");

    // Verify redirect with sufficient timeout for setTimeout + navigation
    cy.url({ timeout: 5000 }).should("eq", Cypress.config().baseUrl + "/");
  });
});
