/// <reference types="cypress" />
describe('SnapChef App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the home page and has correct title', () => {
    cy.contains('SnapChef');
    cy.contains('Tap to take a photo');
  });

  it('allows manual ingredient entry and finding recipes', () => {
    // 1. Enter an ingredient
    // Targeting ion-input directly in Cypress often allows typing if the component proxies it correctly.
    // If not, we might need to find the native input, but let's try the recommended Ionic way with test id.
    cy.get('[data-testid="ingredient-input"]').type('Tomato');

    // 2. Click Add button
    cy.get('[data-testid="add-btn"]').click();

    // 3. Verify ingredient is added to list
    cy.contains('Tomato').should('be.visible');

    // 4. Click Find Recipes
    cy.contains('Find Recipes').click();

    // 5. Verify navigation to recipes page
    cy.url().should('include', '/recipes');
    cy.url().should('include', 'ingredients=Tomato');
  });
});
