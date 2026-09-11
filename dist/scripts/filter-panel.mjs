import { getChallengeList } from "./listHandling.mjs";
import { putCardsInDOM } from "./domManipulation.mjs";

// Knapp för att öppna/stänga filterpanelen
const filterToggle = document.querySelector("#filterToggle");
const filterPanel = document.querySelector("#filters");
const filterClose = document.querySelector(".filter-header__close");

// Öppna och stäng filter-panelen
if (filterToggle && filterPanel && filterClose) {
  filterToggle.addEventListener("click", () => {
    filterPanel.hidden = false;
    filterToggle.hidden = true;
  });

  filterClose.addEventListener("click", () => {
    filterPanel.hidden = true;
    filterToggle.hidden = false;
  });

  // Stäng med ESC
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !filterPanel.hidden) {
      filterPanel.hidden = true;
      filterToggle.hidden = false;
    }
  });
}

// Hämta parametrar från URL (?type=online osv.)
const cardsContainer = document.querySelector(".cards-grid");
const urlParams = new URLSearchParams(window.location.search);
const rawTypeParam = urlParams.get("type") || urlParams.get("filter");
const initialTypeParam = rawTypeParam === "on-site" ? "onsite" : rawTypeParam;

let allChallenges = [];
let baseChallenges = [];

let errorWithCards = false;

// Filter-element
const onlineCheckbox = document.querySelector("#f-online");
const onsiteCheckbox = document.querySelector("#f-onsite");

const filterCheckboxLabels = document.querySelectorAll("#filters .filter-checkbox");
const ratingWidgets = document.querySelectorAll(".rating-widget");
const minRatingWidget = document.querySelector('.rating-widget[data-role="min"]');
const maxRatingWidget = document.querySelector('.rating-widget[data-role="max"]');
const tagButtons = document.querySelectorAll(".tag-pill");
const searchInput = document.querySelector("#f-query");
const resetBtn = document.querySelector("#filterReset");

// Labels för custom-style
const onlineLabel = onlineCheckbox?.closest(".filter-checkbox");
const onsiteLabel = onsiteCheckbox?.closest(".filter-checkbox");

// Filter-state
let activeTags = new Set();
let minRating = 0;
let maxRating = 5;


// Synka visuellt för custom checkbox
filterCheckboxLabels.forEach((label) => {
  const input = label.querySelector(".filter-checkbox__input");
  if (!input) return;

  label.classList.toggle("is-checked", input.checked);

  // Klick på label togglar checkboxen
  label.addEventListener("click", (e) => {
    e.preventDefault();
    input.checked = !input.checked;
    label.classList.toggle("is-checked", input.checked);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
});


async function initFilters() {
  try {
    // Hämta challenge-listan från API
    const list = await getChallengeList();
    allChallenges = Array.isArray(list) ? list : [];
    baseChallenges = [...allChallenges];

    if (baseChallenges[0].type === "error") {
      errorWithCards = true;
    }

    // default: båda på
    onlineCheckbox.checked = true;
    onsiteCheckbox.checked = true;

    // Om användaren kom in med ?type=online m.m.
    if (initialTypeParam && initialTypeParam !== "none") {
      if (initialTypeParam === "online") {
        onlineCheckbox.checked = true;
        onsiteCheckbox.checked = false;
      } else if (initialTypeParam === "onsite") {
        onlineCheckbox.checked = false;
        onsiteCheckbox.checked = true;
      }
    }

    onlineLabel?.classList.toggle("is-checked", onlineCheckbox.checked);
    onsiteLabel?.classList.toggle("is-checked", onsiteCheckbox.checked);

    // sätt initialt utseende för rating widgets
    ratingWidgets.forEach((widget) => {
      const role = widget.dataset.role;
      const value = role === "min" ? minRating : maxRating;
      updateStarUI(widget, value);
    });

    setupFilterEvents();
    applyFilters();

  } catch {
    cardsContainer.innerHTML = `<p class="loading-fail">Could not load challenges from remote with error message: ${baseChallenges[0].description}</p>`;
  }
}


function setupFilterEvents() {
  // Typ-filter
  onlineCheckbox?.addEventListener("change", () => {
    onlineLabel?.classList.toggle("is-checked", onlineCheckbox.checked);
    applyFilters();
  });

  onsiteCheckbox?.addEventListener("change", () => {
    onsiteLabel?.classList.toggle("is-checked", onsiteCheckbox.checked);
    applyFilters();
  });

    // Rating-filter (stjärnor)
  ratingWidgets.forEach((widget) => {
  widget.addEventListener("click", (e) => {
    const target = e.target;
    if (!target.classList.contains("star")) return;

    const val = Number(target.dataset.value);
    const role = widget.dataset.role;

    if (role === "min") {
      const newMin = (minRating === val) ? 0 : val;
      minRating = newMin;

      if (minRating > maxRating) {
        maxRating = minRating;
        if (maxRatingWidget) updateStarUI(maxRatingWidget, maxRating);
      }

      updateStarUI(widget, minRating);

    } else if (role === "max") {
      const newMax = (maxRating === val) ? 5 : val;
      maxRating = newMax;

      if (maxRating < minRating) {
        minRating = maxRating;
        if (minRatingWidget) updateStarUI(minRatingWidget, minRating);
      }

      updateStarUI(widget, maxRating);
    }

    applyFilters();
  });
  // hover: förhandsvisa rating
  const stars = widget.querySelectorAll(".star");

  stars.forEach((star) => {
    star.addEventListener("mouseenter", () => {
      const hoverVal = Number(star.dataset.value);

      stars.forEach((s) => {
        const v = Number(s.dataset.value);
        s.classList.toggle("is-active", v <= hoverVal);
      });
    });

    star.addEventListener("mouseleave", () => {
      const role = widget.dataset.role;
      const value = role === "min" ? minRating : maxRating;
      updateStarUI(widget, value);
    });
  });
});


  // Taggar
  tagButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.textContent.trim().toLowerCase();

      if (activeTags.has(tag)) {
        activeTags.delete(tag);
        btn.classList.remove("is-active");
      } else {
        activeTags.add(tag);
        btn.classList.add("is-active");
      }

      applyFilters();
    });
  });

  // Text-sökning
  searchInput?.addEventListener("input", applyFilters);

  resetBtn?.addEventListener("click", () => {
    onlineCheckbox.checked = true;
    onsiteCheckbox.checked = true;
    onlineLabel?.classList.add("is-checked");
    onsiteLabel?.classList.add("is-checked");

    minRating = 0;
    maxRating = 5;
    ratingWidgets.forEach((widget) => {
      updateStarUI(widget, widget.dataset.role === "min" ? minRating : maxRating);
    });

    activeTags.clear();
    tagButtons.forEach((btn) => btn.classList.remove("is-active"));

    if (searchInput) {
      searchInput.value = "";
    }

    applyFilters();
  });
}


// FILTRERING 

function applyTypeFilter(list) {
  const showOnline = onlineCheckbox.checked;
  const showOnsite = onsiteCheckbox.checked;

  // Om båda är av, visa inget
  if (!showOnline && !showOnsite) return [];

  return list.filter(
    (ch) =>
      (showOnline && ch.type === "online") ||
      (showOnsite && (ch.type === "onsite" || ch.type === "on-site"))
  );
}

function updateStarUI(widget, value) {
  widget.querySelectorAll(".star").forEach((star) => {
    const v = Number(star.dataset.value);
    star.classList.toggle("is-active", v <= value);
  });
}

function applyRatingFilter(list) {
  return list.filter((ch) => ch.rating >= minRating && ch.rating <= maxRating);
}

function applyTagFilter(list) {
  if (activeTags.size === 0) return list;

  return list.filter((ch) => {
    if (!Array.isArray(ch.labels)) return false;
    const labels = ch.labels.map((l) => String(l).toLowerCase());
    return [...activeTags].every((t) => labels.includes(t));
  });
}

function applyTextFilter(list) {
  const q = searchInput.value.toLowerCase().trim();
  if (!q || q.length < 3) return list;


  // Sök i title + description
  return list.filter(
    (ch) =>
      ch.title.toLowerCase().includes(q) ||
      ch.description.toLowerCase().includes(q)
  );
}


// Kör alla filter
function applyFilters() {
  let filtered = [...baseChallenges];

  filtered = applyTypeFilter(filtered);
  filtered = applyRatingFilter(filtered);
  filtered = applyTagFilter(filtered);
  filtered = applyTextFilter(filtered);

  // Om inga matchningar
  if (!filtered.length && !errorWithCards) {
    cardsContainer.removeAttribute('class');
    cardsContainer.innerHTML = '<p class="no-matches">No matching challenges</p>';
    return;
  } else if (errorWithCards) {
    cardsContainer.removeAttribute('class');
    cardsContainer.innerHTML = `<p class='loading-fail'>Challenge Cards failed to load with error message:  ${cardArray[0].description}</p>`;
    return;
  }

  cardsContainer.innerHTML = "";
  cardsContainer.setAttribute('class', 'cards-grid');
  putCardsInDOM(filtered, cardsContainer);
}

initFilters();
