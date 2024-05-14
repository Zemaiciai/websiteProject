import React from 'react'
import BanPage from './ban'

describe('<BanPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<BanPage />)
  })
})