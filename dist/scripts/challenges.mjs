import { getChallengeList, tagsList } from "./listHandling.mjs";
import { putCardsInDOM, putFilterTagsInDOM } from "./domManipulation.mjs";
let challengeCards;
let filterTags = new Set();
const informationString = window.location.search;
const infoParameters = new URLSearchParams(informationString);
const filterValue = infoParameters.get('type');
// DOM Pointers
const cards_container = document.querySelector('.cards-grid');
const tags_container = document.querySelector('.tag-list');
const loadIndicator = document.querySelector('.load-indicator');
challengeCards = await getChallengeList(loadIndicator);
filterTags = tagsList(challengeCards);
if (cards_container) {
    let tempChallenges;
    if (filterValue !== 'none') {
        tempChallenges = challengeCards.filter((element) => element.type === filterValue);
    }
    else {
        tempChallenges = challengeCards;
    }
    putCardsInDOM(tempChallenges, cards_container);
}
else {
    console.error('DOM Pointer for card container not connected!');
}
if (tags_container) {
    putFilterTagsInDOM(filterTags, tags_container);
}
else {
    console.error('DOM Pointer for tags container not connected!');
}
