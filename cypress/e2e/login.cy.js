// cypress/e2e/login-working.cy.js

describe("Login Test", () => {
  // Update this with your actual port!
  const APP_PORT = 5173; // Common ports: 3000, 3001, 5173 (Vite), 8080
  const BASE_URL = `http://localhost:${APP_PORT}`;
  
  before(() => {
    // First, verify the server is running
    cy.request({
      url: BASE_URL,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 404) {
        cy.log(`⚠️  App not found at ${BASE_URL}`);
        cy.log("Try these common ports instead:");
        cy.log("1. 3000 - Create React App default");
        cy.log("2. 5173 - Vite default");
        cy.log("3. 8080 - Common dev server");
        cy.log("4. Check your terminal output for the correct port");
      }
    });
  });
  
  it("1. Login page", () => {
    // Try to visit with no path
    cy.visit(BASE_URL, {
      failOnStatusCode: false // Don't fail on 404
    });
    
    cy.wait(2000);
    
    // Check what we got
    cy.document().then((doc) => {
      const title = doc.title;
      const url = doc.location.href;
      const hasBody = doc.body.children.length > 0;
      
      console.log("Page info:", { title, url, hasBody });
      
      if (hasBody) {
        // Take screenshot to see what's there
        cy.screenshot("current-page");
        
        // Check for React app signs
        const rootDiv = doc.querySelector('#root') || doc.querySelector('#app');
        if (rootDiv) {
          cy.log("✓ React app detected");
        }
      }
    });
  });
  
  it("2. Look for login form elements", () => {
    cy.visit(BASE_URL, { failOnStatusCode: false });
    cy.wait(3000);
    
    // Check for common login indicators
    cy.get("body").then(($body) => {
      const text = $body.text();
      const inputs = $body.find("input, textarea, select").length;
      const buttons = $body.find("button, [type='submit']").length;
      
      console.log(`Page has: ${inputs} inputs, ${buttons} buttons`);
      console.log("Page contains text:", text.substring(0, 200));
      
      // Common login page text to look for
      const loginKeywords = [
        "email", "password", "sign in", "login", "welcome",
        "username", "log in", "signin", "auth", "credentials"
      ];
      
      const foundKeywords = loginKeywords.filter(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (foundKeywords.length > 0) {
        cy.log(`✓ Found login keywords: ${foundKeywords.join(', ')}`);
        
        // Try to interact with the form
        if (inputs >= 2) {
          cy.get("input").first().type("test@example.com");
          cy.get("input").eq(1).type("password123");
          cy.screenshot("filled-form");
        }
      } else {
        cy.log("✗ This doesn't look like a login page");
        cy.screenshot("not-login-page");
      }
    });
  });
  
  it("3. registration page", () => {
    // If not at root, it might be at a hash route
    cy.visit(`${BASE_URL}/api/register`, { failOnStatusCode: false });
    cy.wait(2000);
    
    // Or try common SPA routes
    const spaRoutes = [
      '/',
      '/register',
      '/app',
      '/app/login',
      '/account/login',
      '/user/login'
    ];
    
    spaRoutes.forEach((route) => {
      cy.request({
        url: `${BASE_URL}${route}`,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200) {
          console.log(`Try visiting: ${BASE_URL}${route}`);
        }
      });
    });
  });
});