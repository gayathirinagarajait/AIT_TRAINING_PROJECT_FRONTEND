import Dashboard from './Dashboard';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

describe('Dashboard UI', () => {
  beforeEach(() => {
    // Match EXACT API endpoints from your logs
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
        { id: 3, name: 'User 3' }
      ]
    }).as('getUsers');

    cy.intercept('GET', '/api/products', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Product 1', stock: 25 },
        { id: 2, name: 'Product 2', stock: 5 },
        { id: 3, name: 'Product 3', stock: 0 },
        { id: 4, name: 'Product 4', stock: 15 }
      ]
    }).as('getProducts');

    cy.mount(
      <ThemeProvider theme={theme}>
        <Dashboard />
      </ThemeProvider>
    );
  });

  it('should render dashboard layout', () => {
    cy.wait('@getUsers');
    cy.wait('@getProducts');
    
    // Core layout elements
    cy.contains('Dashboard Overview').should('be.visible');
    cy.contains('Monitoring system performance').should('be.visible');
    cy.contains('Inventory Health Metrics').should('be.visible');
  });

  it('should render all 4 stat card titles', () => {
    cy.wait('@getUsers');
    
    cy.contains('Total Users').should('be.visible');
    cy.contains('Total Products').should('be.visible');
    cy.contains('In-Stock Items').should('be.visible');
    cy.contains('Low Stock Alerts').should('be.visible');
  });

  it('should display numeric stat values', () => {
    cy.wait('@getProducts');
    
    // Just check numbers exist - no h1 assumption
    cy.contains('3').should('be.visible');  
    cy.contains('4').should('be.visible');  
    cy.contains(/\d+/).should('be.visible'); 
  });

  it('should render health metrics', () => {
    cy.wait('@getProducts');
    
    cy.contains('Out of Stock').should('be.visible');
    cy.contains('Stock Ratio').should('be.visible');
    cy.contains('Efficiency').should('be.visible');
    cy.contains('Active Alerts').should('be.visible');
  });

  it('should render cards and avatars', () => {
    cy.wait('@getUsers');
    
    // MUI Card components
    cy.get('[data-testid*="MuiCard"], .MuiCard-root').should('exist');
    
    // Avatar icons
    cy.get('.MuiAvatar-root svg').should('exist');
  });
});
