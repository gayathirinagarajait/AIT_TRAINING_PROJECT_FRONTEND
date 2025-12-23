import { describe, it } from 'cypress/component';
import ProductTable from './ProductTable';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

describe('ProductTable', () => {
  it('renders table', () => {
    const mockRows = [{ _id: '1', name: 'Test Product', price: 100, stock: 10 }];
    
    cy.mount(
      <ThemeProvider theme={theme}>
        <ProductTable rows={mockRows} />
      </ThemeProvider>
    );
    
    cy.contains('Total Products: 1').should('be.visible');
    cy.contains('Test Product').should('be.visible');
  });
});
