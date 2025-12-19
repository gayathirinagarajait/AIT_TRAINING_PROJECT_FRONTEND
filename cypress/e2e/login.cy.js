describe("Login Page", () => {
  it("should load login page", () => {
    cy.visit("/");
    cy.contains("Login").should("be.visible");
  });
});
