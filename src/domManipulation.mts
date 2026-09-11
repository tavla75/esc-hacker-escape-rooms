import type { oneChallenge } from "./interfaces.mjs";
import { takeAction } from "./index.mjs";

export const putCardsInDOM = (
  cardArray: Array<oneChallenge>,
  container: HTMLElement
): void => {
  if (!(cardArray[0]?.type === "error")) {
      cardArray.forEach((element) => {
      const cardImg: HTMLImageElement = document.createElement("img");
      cardImg.setAttribute("src", element.image);
      cardImg.setAttribute("class", "card__image");

      const cardType: HTMLImageElement = document.createElement("img");
      cardType.setAttribute(
        "src",
        element.type === "online"
          ? "resources/online.png"
          : element.type === "onsite"
          ? "resources/onsite.png"
          : ""
      );
      cardType.setAttribute("alt", element.type);
      cardType.setAttribute("class", "card__type");

      const card_title: HTMLElement = document.createElement("h4");
      card_title.setAttribute("class", "card__title");
      card_title.innerText = element.title;

      const rating_container: HTMLElement = document.createElement("div");
      const rating: HTMLElement = document.createElement("span");
      const rating_real: number = element.rating;
      const rating_rounded: number = Math.ceil(element.rating);
      for (let index = 1; index <= rating_rounded; index++) {
        const rating_star: HTMLImageElement = document.createElement("img");
        if (0 < index - rating_real && index - rating_real < 1) {
          rating_star.setAttribute("src", "resources/Star 3 half.svg");
          rating_star.setAttribute("class", "rating__star--half");
          rating.appendChild(rating_star);
        } else {
          rating_star.setAttribute("src", "resources/Star 3.svg");
          rating_star.setAttribute("class", "rating__star");
          rating.appendChild(rating_star);
        }
      }
      if (5 - rating_rounded > 0) {
        for (let index = 0; index < 5 - rating_rounded; index++) {
          const rating_star: HTMLImageElement = document.createElement("img");
          rating_star.setAttribute("src", "resources/Star 3 hollow.svg");
          rating_star.setAttribute("class", "rating__star--empty");
          rating.appendChild(rating_star);
        }
      }
      rating_container.appendChild(rating);
      rating_container.setAttribute("class", "rating-container");
      const room_participants: HTMLElement = document.createElement("span");
      room_participants.innerText =
        element.minParticipants +
        " - " +
        element.maxParticipants +
        " participants";
      room_participants.setAttribute("class", "card__room-participants");
      rating_container.appendChild(room_participants);

      const card_description: HTMLElement = document.createElement("div");
      const descriptionLimit: number = 50;
      card_description.setAttribute("class", "card__description");
      let descriptionToUse: string = element.description;
      let arrayOfWords: Array<string> = [];
      let numberOfWords: number = 0;
      if (element.description.length > descriptionLimit) {
        let tempDescription: string = descriptionToUse.trim();
        arrayOfWords = tempDescription.split(' ');
        let descLength: number = 0;
        let wordCount: number = 0;
        arrayOfWords.forEach((word) => {
          descLength += (word.length + 1);
          if (descLength < descriptionLimit) {
            wordCount++;
          }
        });
        numberOfWords = arrayOfWords.length;
        descriptionToUse = (arrayOfWords.splice(0, wordCount).join(' '));
        if (numberOfWords > wordCount) {
          descriptionToUse += "...";
        }
      }
      card_description.innerText = descriptionToUse;

      const card_button: HTMLButtonElement = document.createElement("button");
      card_button.setAttribute("class", "card__button");
      card_button.setAttribute("data-type", "booking");
      card_button.setAttribute("data-id", "" + element.id);
      card_button.innerText =
        element.type === "online" ? "Take challenge online" : "Book this room";
      card_button.addEventListener("click", (event) => {
        takeAction(event);
      });
      card_button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          takeAction(event);
        }
      });

      const card: HTMLElement = document.createElement("article");
      card.setAttribute("id", "" + element.id);
      card.setAttribute("class", "card");
      card.setAttribute("data-type", element.type);
      card.appendChild(cardImg);
      card.appendChild(cardType);
      card.appendChild(card_title);
      card.appendChild(rating_container);
      card.appendChild(card_description);
      card.appendChild(card_button);

      container.appendChild(card);
    });
  } else if (cardArray[0]?.id === -1){
    let errorMessageDiv: HTMLParagraphElement = document.createElement('p');
    errorMessageDiv.setAttribute('class', 'loading-fail');
    errorMessageDiv.innerText = `Challenge Cards failed to load with error message:  ${cardArray[0].description}`;
    container.removeAttribute('class');
    container.appendChild(errorMessageDiv);
  }
};

export function putFilterTagsInDOM(setOfTags: Set<string>, domElement: HTMLElement) {
    setOfTags.forEach((tag: string) => {
        tag = tag[0]?.toUpperCase() + tag.slice(1).toLowerCase();
        const tag_pill: HTMLElement = document.createElement('button');
        tag_pill.setAttribute('class', 'tag-pill');
        tag_pill.innerText = tag;
        domElement.appendChild(tag_pill);
    });
}