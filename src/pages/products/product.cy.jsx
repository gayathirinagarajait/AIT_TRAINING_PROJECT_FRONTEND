describe('Products Page', () => {
  beforeEach(() => {
    // 🔐 Mock authentication (adjust keys if needed)
    window.localStorage.setItem('token', 'fake-jwt-token');
    window.localStorage.setItem(
      'user',
      JSON.stringify({ id: 1, role: 'admin' })
    );

    // 🧹 Clear filters so table is not empty
    window.sessionStorage.removeItem('productFilters');

    // 🔁 Intercept products API (Redux thunk)
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/products**',
      },
      { fixture: 'products.json' }
    ).as('getProducts');

    cy.intercept(
      'DELETE',
      '**/api/products/*',
      { statusCode: 200 }
    ).as('deleteProduct');

    cy.visit('/products');

    // Ensure we stayed on products page
    cy.url().should('include', '/products');
  });

  it('loads products table', () => {
    // Table container exists
    cy.get('[data-cy=product-table]').should('exist');

    // At least one row rendered
    cy.get('table tbody tr').should('have.length.at.least', 1);
  });

  it('applies and resets filters', () => {
    cy.get('[data-cy=product-filters]').within(() => {
      cy.contains(/apply/i).click();
    });

    cy.get('table tbody tr').should('exist');

    cy.get('[data-cy=product-filters]').within(() => {
      cy.contains(/reset/i).click();
    });
  });

  it('opens delete confirmation and deletes product', () => {
    // Click first delete icon button
    cy.get('[data-cy=product-table]')
      .find('button')
      .filter('[aria-label*=delete], [data-cy*=delete]')
      .first()
      .click({ force: true });

    // Confirm dialog
    cy.contains('Delete Product').should('be.visible');
    cy.contains(/are you sure/i).should('be.visible');

    cy.contains(/confirm|yes|ok/i).click();

    // Success snackbar
    cy.contains('Product deleted successfully').should('be.visible');
  });

  it('opens image modal when image is clicked', () => {
    // Click image inside table (img rendered via buildImageUrl)
    cy.get('[data-cy=product-table]')
      .find('img')
      .first()
      .click({ force: true });

    // Modal opens
    cy.get('[role=dialog]').should('exist');
    cy.contains(/product image/i).should('be.visible');
  });

  it('navigates images in modal', () => {
    cy.get('[data-cy=product-table]')
      .find('img')
      .first()
      .click({ force: true });

    cy.get('[role=dialog]').within(() => {
      cy.get('button').contains(/next/i).click({ force: true });
      cy.get('button').contains(/prev/i).click({ force: true });
    });
  });
});
