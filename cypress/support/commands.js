// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress/support/commands.js

Cypress.Commands.add("login", (email = "lensy@example.com", password = "123456") => {
  cy.session([email, password], () => {
    cy.visit("/");
    cy.intercept("POST", "**/api/auth/login").as("login");
    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type(password);
    cy.get("button[type='submit']").click();
    cy.wait("@login");
    cy.url().should("include", "/dashboard");
  });
});


Cypress.Commands.add("logout", () => {
  cy.get("[data-testid='logout-button']").click();
  cy.url().should("include", "/");
});

Cypress.Commands.add("clearForm", () => {
  cy.get("input[name='email']").clear();
  cy.get("input[name='password']").clear();
});