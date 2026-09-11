import type { oneChallenge } from "./interfaces.mjs";
import { getChallengeList, tagsList } from "./listHandling.mjs";
import { putCardsInDOM, putFilterTagsInDOM } from "./domManipulation.mjs";

let challengeCards: Array<oneChallenge>;
let filterTags: Set<string> = new Set();
const informationString: string = window.location.search;
const infoParameters: URLSearchParams = new URLSearchParams(informationString);
const filterValue = infoParameters.get('type');

// DOM Pointers
const cards_container: HTMLElement = document.querySelector('.cards-grid') as HTMLElement;
const tags_container: HTMLElement = document.querySelector('.tag-list') as HTMLElement;
const loadIndicator: HTMLElement = document.querySelector('.load-indicator') as HTMLElement;

challengeCards = await getChallengeList(loadIndicator);
filterTags = tagsList(challengeCards);

if(cards_container) {
    let tempChallenges: Array<oneChallenge>;
    if (filterValue !== 'none') {
        tempChallenges = challengeCards.filter((element) => element.type === filterValue);
    } else {
        tempChallenges = challengeCards;
    }
    putCardsInDOM(tempChallenges, cards_container);
} else {
    console.error('DOM Pointer for card container not connected!');
}

if(tags_container) {
    putFilterTagsInDOM(filterTags, tags_container);
} else {
    console.error('DOM Pointer for tags container not connected!');
}
