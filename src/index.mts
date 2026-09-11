import { openBookingModal } from "./booking.mjs";
import { getChallengeList, sortOutTopRated } from "./listHandling.mjs";
import { putCardsInDOM } from "./domManipulation.mjs";

// DOM-pointers
const home: HTMLImageElement = document.querySelector(
  ".header__logo"
) as HTMLImageElement;
const navigation: HTMLElement = document.querySelector(
  ".navigation"
) as HTMLElement;

const allButtons: NodeListOf<HTMLButtonElement> =
  document.querySelectorAll("button");
const card_section: HTMLElement = document.querySelector(
  ".card-container"
) as HTMLElement;
const loadIndicator: HTMLElement = document.querySelector('.load-indicator') as HTMLElement;
const footer: HTMLElement = document.querySelector(".footer") as HTMLElement;

home.addEventListener("click", () => {
  window.location.assign(`./index.html`);
});
home.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    window.location.assign(`./index.html`);
  }
});

navigation.addEventListener("click", (event) => {
  takeAction(event);
});
navigation.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    takeAction(event);
  }
});

allButtons.forEach((node) => {
  node.addEventListener("click", (event) => {
    takeAction(event);
  });
  node.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      takeAction(event);
    }
  });
});

footer.addEventListener("click", (event) => {
  takeAction(event);
});
footer.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    takeAction(event);
  }
});

export function takeAction(event: Event): void {
  event.preventDefault();
  const target: HTMLElement = event.target as HTMLElement;
  if (target.tagName === "A" || target.tagName === "BUTTON") {
    const action: string = target.dataset.type as string;
    const targetId: string = target.dataset.id as string;
    switch (action) {
      case "online":
        window.location.assign(`./challenges.html?type=online`);
        break;

      case "on-site":
      case "onsite":
        window.location.assign(`./challenges.html?type=onsite`);
        break;

      case "see_all":
        window.location.assign(`./challenges.html?type=none`);
        break;

      case "story":
        window.location.assign(`./storypage.html`);
        break;

      case "contact":
        window.location.assign(`./contact.html`); // Maybe contact should be just a modal?
        break;

      case "legal":
        window.location.assign(`./legal.html`);
        break;

      case "filter":
        // code for opening modal with filter form should be here
        break;

      case "booking":
        openBookingModal(targetId);
        break;

      default:
        console.log("Going nowhere!");
    }
  }
}


// Function that inserts top three challenge-cards in the startpage


// //Navigering till challenge sidan med förfiltrering
// function goToChallengePage(type: string) {
//     window.location.assign(`./challenges.html?type=${encodeURIComponent(type)}`);
// }
// //Hämtar alla knappar för navigering till challenge sidan
// const challengeNavButtons = document.querySelectorAll<HTMLButtonElement>('.js-challenge-nav');

// //Lägger till event listeners för varje knapp
// challengeNavButtons.forEach(btn => {const type = btn.dataset.type || '';

//     //Klick och tangenttryckning för tillgänglighet
//     btn.addEventListener('click', () => goToChallengePage(type));

// Gör knapparna åtkomliga via tangentbordet
// btn.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' || e.key === ' ') {
//         e.preventDefault(); //Förhindra scrollning vid mellanslag
//         goToChallengePage(type);
//     }
// });
// });

let challengeArray = await getChallengeList(loadIndicator);
let topRatedChalls = sortOutTopRated(challengeArray);
if (card_section) {
  putCardsInDOM(topRatedChalls, card_section);
}
