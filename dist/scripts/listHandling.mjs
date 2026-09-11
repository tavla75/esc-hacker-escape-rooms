let topRatedChalls = new Array(3).fill({});
let errorCard = {
    "id": 0,
    "type": "error",
    "title": "error",
    "description": "error",
    "minParticipants": 0,
    "maxParticipants": 0,
    "rating": 0,
    "image": "",
    "labels": [""]
};
async function fetchChallengesAndSaveToLocal(loadIndicator) {
    try {
        loadIndicator.style.display = 'flex';
        const url = "https://lernia-sjj-assignments.vercel.app/api/challenges";
        const response = await fetch(url);
        if (!response.ok) {
            errorCard.id = -1;
            errorCard.description = `Response status: ${response.status}`;
            return [errorCard];
        }
        const data = await response.json();
        const challengesList = data.challenges;
        localStorage.clear();
        localStorage.setItem("savedChallenges", JSON.stringify(challengesList));
        localStorage.setItem("lastFetch", JSON.stringify(Date.now()));
        loadIndicator.style.display = 'none';
        return challengesList;
    }
    catch (error) {
        errorCard.description = ` ${error.message}`;
        return [errorCard];
    }
}
const checkIntervall = () => {
    let lastFetchString = localStorage.getItem("lastFetch");
    let lastFetchTime = 0;
    if (lastFetchString) {
        lastFetchTime = +lastFetchString;
    }
    const timeNow = Date.now();
    return timeNow - lastFetchTime < 30000;
};
export function getChallengeList(loadIndicator) {
    let tempChallengeArray = [];
    if (localStorage.getItem("savedChallenges") && checkIntervall()) {
        const tempStorage = localStorage.getItem("savedChallenges");
        if (tempStorage) {
            tempChallengeArray = JSON.parse(tempStorage);
        }
        else {
            errorCard.description = "Problem has arised with challenges saved in localStorage.";
            tempChallengeArray = [errorCard];
        }
    }
    else {
        const tempArray = fetchChallengesAndSaveToLocal(loadIndicator);
        tempChallengeArray = tempArray;
    }
    return tempChallengeArray;
}
export function sortOutTopRated(inputArray) {
    let newTopThree = [];
    if (localStorage.getItem("savedTopThree") && checkIntervall()) {
        const tempTopThree = localStorage.getItem("savedTopThree");
        if (tempTopThree) {
            topRatedChalls = JSON.parse(tempTopThree);
        }
        else {
            // throw new Error(
            //     "Problem has arised with top three list saved in localStorage"
            // );
            errorCard.description = "Problem has arised with top three list saved in localStorage";
            return [errorCard];
        }
    }
    else if (!(inputArray[0]?.type === 'error')) {
        const sortedArray = [...inputArray].sort((a, b) => b.rating - a.rating);
        newTopThree = sortedArray.slice(0, 3);
        topRatedChalls = newTopThree;
        localStorage.setItem("savedTopThree", JSON.stringify(newTopThree));
    }
    else {
        topRatedChalls = [errorCard];
    }
    return topRatedChalls;
}
export function tagsList(challenges) {
    let tags = new Set();
    challenges.forEach((element) => {
        element.labels.forEach((tag) => {
            tags.add(tag);
        });
    });
    return tags;
}
