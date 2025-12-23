describe('Products Page - MUI DataGrid', () => {
  beforeEach(() => {
    // Fake auth
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem(
      'user',
      JSON.stringify({ role: 'admin' })
    );

    sessionStorage.removeItem('productFilters');

    // Intercepts (do NOT wait on them)
    cy.intercept('GET', '**/api/products**', {
      fixture: 'products.json',
    });

    cy.intercept('DELETE', '**/api/products/*', {
      statusCode: 200,
    });

    cy.visit('/products');
    cy.url().should('include', '/products');
  });

  it('renders product rows', () => {
    // DataGrid exists
    cy.get('.MuiDataGrid-root').should('exist');

    // DataGrid rows (not <tr>)
    cy.get('[role="row"][data-rowindex]', { timeout: 10000 })
      .should('have.length.at.least', 1);
  });

  it('opens delete confirmation and deletes product', () => {
    cy.get('[data-cy=delete-product-btn]')
      .first()
      .click({ force: true });

    cy.contains('Delete Product').should('be.visible');

    cy.contains(/confirm|yes|ok/i).click();

    cy.contains('Product deleted successfully')
      .should('be.visible');
  });

  it('opens edit product form', () => {
    cy.get('[data-cy=edit-product-btn]')
      .first()
      .click({ force: true });

    cy.get('[data-cy=product-form]')
      .should('exist');
  });
});
