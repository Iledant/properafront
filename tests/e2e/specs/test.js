/// <reference types="Cypress" />

describe('Initialisation', () => {
  it('Restauration de la base de test', () => {
    cy.exec('fsd restore_test propera')
  }
  )
  it('Home page loads', () => {
    cy.visit('/')
    cy.contains('Connexion')
  })
})

describe('Inscription utilisateur', () => {
  it('Inscription d\'un nouvel utilisateur', () => {
    cy.get('[data-cy=signUp]').click()
    cy.contains('Inscription à Propera')
    cy.get('[data-cy=signUpFullName]').type(Cypress.env('newUserName'))
    cy.get('[data-cy=signUpEmail]').type(Cypress.env('newUserEmail'))
    cy.get('[data-cy=signUpPassword]').type(Cypress.env('newUserPassword'))
    cy.get('[data-cy=signUpOk]').click()
    cy.contains('Votre compte est créé')
    cy.get('[data-cy=successOk]').click()
    cy.get('[data-cy=successOk]').should('not.be.visible')
  })
})

describe('Opérations administrateur', () => {
  it('Connexion', () => {
    cy.get('[data-cy=email').type(Cypress.env('adminEmail'))
    cy.get('[data-cy=password').type(Cypress.env('adminPassword'))
    cy.get('[data-cy=logIn').click()
    cy.contains('Propera')
  })
  it('Changement du message du jour', () => {
    cy.get('[data-cy=homeEditTodayMsg]').click()
    cy.contains('Message du jour')
    cy.contains('Événements prévus d\'ici un mois')
    cy.contains('Consommation de crédits de paiement')
    cy.contains('Engagement des AP')
    cy.get('[data-cy=todayMsgTitle]').type('Titre du message de test')
    cy.get('[data-cy=todayMsgText]').type('Texte du message de test pour vérification')
    cy.get('[data-cy=todayMsgCancel]').click()
    cy.contains('Bienvenue dans Propera')
    cy.get('[data-cy=homeEditTodayMsg]').click()
    cy.get('[data-cy=todayMsgTitle]').clear().type('Titre du msg de test')
    cy.get('[data-cy=todayMsgText]').clear().type('Texte du msg de test pour vérification')
    cy.get('[data-cy=todayMsgOk]').click()
    cy.contains('Titre du msg de test')
    cy.contains('Texte du msg de test pour vérification')
  })
  it('Ouverture du menu', () => {
    cy.get('[data-cy=appMenu]').click()
    cy.get('[data-cy=homeMenuItem]').should('be.visible')
  })
  it('Activation de l\'utilisateur inscrit', () => {
    cy.get('[data-cy=settingsMenuItem]').click()
    cy.get('[data-cy=usersMenuItem]').click()
    cy.contains('Gestion des utilisateurs')
    cy.get('[data-cy=userSearch]').type(Cypress.env('newUserName'))
    cy.contains(Cypress.env('newUserEmail'))
    cy.get('[data-cy=userModify]').click()
    cy.contains('Modifier les données de l\'utilisateur')
    cy.get('[data-cy=userDlgName]').clear().type(Cypress.env('newUserName2'))
    cy.get('[data-cy=userDlgEmail]').clear().type(Cypress.env('newUserEmail2'))
    cy.get('[data-cy=userDlgPassword]').type(Cypress.env('newUserPassword2'))
    cy.get('[data-cy=userDlgActive]').click({ force: true })
    cy.get('[data-cy=userDlgSave]').click()
    cy.contains(Cypress.env('newUserName2'))
    cy.contains(Cypress.env('newUserEmail2'))
    cy.contains('oui')
  })
  it('Création directe d\'un nouvel utilisateur', () => {
    cy.get('[data-cy=userAdd]').click()
    cy.contains('Nouvel utilisateur')
    cy.get('[data-cy=userDlgName]').clear().type(Cypress.env('newUserName3'))
    cy.get('[data-cy=userDlgEmail]').clear().type(Cypress.env('newUserEmail3'))
    cy.get('[data-cy=userDlgPassword]').type(Cypress.env('newUserPassword3'))
    cy.get('[data-cy=userDlgActive]').click({ force: true })
    cy.get('[data-cy=userDlgSave]').click()
    cy.contains(Cypress.env('newUserName3'))
    cy.contains(Cypress.env('newUserEmail3'))
  })
})
