describe("Login component", () => {
  it("Visits the login page", () => {
    cy.visit("/login");
    cy.get("[data-cy=loginWelcome]").contains("Welcome!").should("be.visible");
  });
  it("Visits the /apps page", () => {
    cy.visit("/apps");
    // we're not logged in, we should display the Welcome message with the login
    cy.get("[data-cy=loginWelcome]").contains("Welcome!").should("be.visible");
  });
});

describe("The Login Page", () => {
  // https://docs.cypress.io/guides/getting-started/testing-your-app#Logging-in
  beforeEach(() => {
    // reset and seed the database prior to every test
    //   cy.exec('npm run db:reset && npm run db:seed')

    // seed a user in the DB that we can control from our tests
    // assuming it generates a random password for us
    //   cy.request('POST', '/test/seed/user', { username: 'jane.lane' })
    //     .its('body')
    //     .as('currentUser')
    cy.wrap({
      username: Cypress.env("username"),
      password: Cypress.env("password"),
    }).as("currentUser");
  });

  it("sets auth cookie when logging in via form submission", function () {
    // destructuring assignment of the this.currentUser object
    const { username, password } = this.currentUser;

    cy.visit("/login");
    cy.get("[data-cy=registered-user]").click();

    cy.get("input[name=username]").type(username);

    // {enter} causes the form to submit
    cy.get("input[name=password]").type(`${password}{enter}`);

    // we should be redirected to /dashboard
    cy.url().should("include", "/apps");
  });
});

describe("The login as guest", () => {
  it("should work", () => {
    cy.visit("/login");
    cy.get("[data-cy=guest-user-login]").click();
    // we should be redirected to /dashboard
    cy.url().should("include", "/apps");
  });
});
describe("The login as unhcr", () => {
  it("should work", () => {
    cy.visit("/login");
    cy.get("[data-cy=unhcr-user-login]").should("be.visible");
    // right now that's enough: https://github.com/cypress-io/cypress/issues/1489 not working here
    // maybe due to the iframe token id
  });
});
