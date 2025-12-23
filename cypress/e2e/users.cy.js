describe('Users Page - MUI Views', () => {
  beforeEach(() => {
    cy.login();
    sessionStorage.removeItem('userFilters');

    cy.intercept('GET', '**/api/users**', { fixture: 'users.json' });
    cy.intercept('PUT', '**/api/users/**', { statusCode: 200 }).as('updateUser');
    cy.intercept('DELETE', '**/api/users/*', { statusCode: 200 }).as('deleteUser');

    cy.visit('/users');
    cy.url().should('include', '/users');
  });

  it('renders users page with view options', () => {
    cy.contains('button', 'List View').should('exist');
    cy.contains('button', 'Grid View').should('exist');
  });

  it('switches to list view and renders user rows', () => {
    cy.contains('button', 'List View').click({ force: true });
    cy.get('.MuiDataGrid-root').should('exist');
    cy.get('[role="row"][data-rowindex]').should('have.length.at.least', 1);
  });

  it('switches to grid view and renders user cards', () => {
    cy.contains('button', 'Grid View').click({ force: true });
    cy.get('.MuiCard-root').should('have.length.at.least', 1);
  });



  it('opens edit user form from list view', () => {
    cy.contains('button', 'List View').click({ force: true });
    cy.get('[data-cy="edit-user-btn"]').first().click({ force: true });
    
    cy.contains('Edit User:').should('exist');
    cy.contains('label', 'Name').should('exist');
    cy.contains('label', 'Email').should('exist');
    cy.contains('label', 'Role').should('exist');
    cy.contains('button', 'Update').should('exist');
  });

  it('fills edit form with force clicks', () => {
    cy.contains('button', 'List View').click({ force: true });
    cy.get('[data-cy="edit-user-btn"]').first().click({ force: true });
    
    // Fix 1: Name & Email - direct input
    cy.contains('label', 'Name').parent().find('input').clear().type('John Updated');
    cy.contains('label', 'Email').parent().find('input').clear().type('john@test.com');
    
    // Fix 2: MUI Select - force click hidden input + menu item
    cy.contains('label', 'Role').parent().find('.MuiSelect-nativeInput').click({ force: true });
    cy.contains('ADMIN').click({ force: true });
    
    cy.contains('button', 'Update').click();
    cy.wait('@updateUser');
  });


});
