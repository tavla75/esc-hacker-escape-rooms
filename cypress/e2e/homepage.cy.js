describe("Homepage", () => {
  it("is running on localhost and displays the headline", () => {
    cy.visit("/");
    cy.get("h1").should("have.text", "Hacker Escape Rooms");
  });
});