describe('Location-based Recipes', () => {
    it('navigates to recipes page with location query when "Find Recipes" is clicked', () => {
        // Mock geolocation
        cy.visit('/', {
            onBeforeLoad(win) {
                cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
                    cb({ coords: { latitude: 40.7128, longitude: -74.0060 } });
                });
            },
        });

        // Add an ingredient first (as Find Recipes is disabled without ingredients)
        cy.get('[data-testid="ingredient-input"]').type('Tomato');
        cy.get('[data-testid="add-btn"]').click();

        cy.contains('Find Recipes').click();

        cy.url().should('include', '/recipes');
        cy.url().should('include', 'lat=40.7128');
        cy.url().should('include', 'lng=-74.006');
        cy.url().should('include', 'ingredients=Tomato');
    });
});
