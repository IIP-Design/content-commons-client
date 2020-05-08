describe('Featured packages box', () => {
  it('returns the results page when a user enters a search term in the search bar', () => {
    cy.visit('/')
      .get('input')
      .type('test{enter}')
      .location().should( (loc) => {
        expect(loc.pathname).to.eq('/results')
        expect(loc.search).to.eq('?language=en-us&term=test&sortBy=relevance&date=recent')
      })
  } )
})