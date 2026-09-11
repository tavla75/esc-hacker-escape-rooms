describe("Homepage", () => {
  it("is running on localhost and displays the headline", () => {
    cy.visit("/");
    cy.get("h1").should("have.text", "Hacker Escape Rooms");
  });

  it("displays the Challenges filter controls", () => {
    cy.visit("/challenges.html?type=none");
    cy.get("#filterToggle").should("be.visible").click();
    cy.get("#filters").should("exist");
    cy.get("#f-query").should("exist");
  });

  it("navigates from the homepage to the Story page", () => {
    cy.visit("/");
    cy.contains("nav a", "The Story").click();
    cy.location("pathname").should("eq", "/storypage.html");
    cy.get("h1").should("have.text", "Story Page");
  });

  it("shows an error when searching for a booking without a date", () => {
    cy.visit("/challenges.html?type=onsite");
    cy.get('.card[data-type="onsite"] .card__button', { timeout: 10000 })
      .first()
      .click();
    cy.get("#booking-date").should("be.visible");
    cy.contains("button", "Search available times").click();
    cy.get("#booking-status").should("have.text", "Please choose a date first.");
  });
});