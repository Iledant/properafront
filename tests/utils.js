// attachApp attach the data-app to the DOM document to avoid the vuetify warning
// during the tests. To bue used at the beginning of the describe function
export const attachApp = document => {
  const app = document.createElement('div')
  app.setAttribute('data-app', true)
  document.body.append(app)
}
