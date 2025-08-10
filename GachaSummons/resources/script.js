// Global Variables
let wishes = 0;
let availableWishes = 0;
let pity = 0;
let FourStarPity = 0;
const FiveStarBaseRate = 6; // 0.6%
const FourStarBaseRate = 51; // 5.1%
const featuredRate = 500; // 50% chance for featured character
let guaranteedFeatured = false; // Tracks if next 5-star is guaranteed featured
let total4StarPulls = 0;
let total5StarPulls = 0;
let featured4StarPulls = 0;
let featured5StarPulls = 0;
let results = []; // Array to store results for each pull
let featuredResults = []; // Array to store 5-star featured pulls

// Random Number Generator
function generateRandom() {
    return Math.floor(Math.random() * 1000); // 0 to 999
}

// Set User Wishes
function setWishes() {
    const userWishes = parseInt(document.getElementById("availableWishes").value);
    if (isNaN(userWishes) || userWishes <= 0) {
        alert("Please enter a valid number of pulls!");
        return;
    }
    availableWishes = userWishes;
    document.getElementById("wishesLeft").innerText = availableWishes;
}

// Set Pity Value
function setPity() {
    const userPity = parseInt(document.getElementById("pityInput").value);
    if (isNaN(userPity) || userPity < 0) {
        alert("Please enter a valid pity value!");
        return;
    }
    pity = userPity; // Set global pity to the user's input value
    FourStarPity = pity >= 10 ? 10 : pity; // Make sure FourStarPity doesn't exceed 10
    alert(`Pity set to ${pity}.`);
}

// Make Wishes
function makeWish(count) {
    if (availableWishes < count) {
        alert("Not enough pulls left!");
        return;
    }

    // Clear results for each new wish
    results = [];
    featuredResults = [];

    for (let i = 0; i < count; i++) {
        wishes++;
        availableWishes--;
        pity++;
        FourStarPity++;

        let currentFiveStarRate = FiveStarBaseRate + (pity > 65 ? (pity - 65) * 39.76 : 0);
        let roll = generateRandom();

        // 5-Star Pull
        if (roll < currentFiveStarRate) {
            pity = 0;
            let isFeatured = guaranteedFeatured || generateRandom() < featuredRate;
            total5StarPulls++;
            if (isFeatured) {
                featured5StarPulls++;
                featuredResults.push("Legendary-Exclusive Featured");
                guaranteedFeatured = false;
            } else {
                results.push("Legendary Non-Featured");
                guaranteedFeatured = true;
            }
            continue;
        }

        // 4-Star Pull
        if (FourStarPity >= 10 || roll < FourStarBaseRate) {
            FourStarPity = 0;
            total4StarPulls++;
            if (generateRandom() < featuredRate) {
                featured4StarPulls++;
                results.push("Epic Featured");
            } else {
                results.push("Epic Non-Featured");
            }
            continue;
        }

        // No 4-star or 5-star
        results.push("Rare");
    }

    updateTracker();
    updateResultsDisplay();
}

// Update Tracker Display
function updateTracker() {
    document.getElementById("wishesMade").innerText = wishes;
    document.getElementById("wishesLeft").innerText = availableWishes;
    document.getElementById("total-4-star").textContent = total4StarPulls;
    document.getElementById("total-5-star").textContent = total5StarPulls;
    document.getElementById("featured-4-star").textContent = featured4StarPulls;
    document.getElementById("featured-5-star").textContent = featured5StarPulls;
}

// Update Results Display
function updateResultsDisplay() {
    document.getElementById("results").innerText = results.join(", ");
    document.getElementById("featuredResults").innerText = featuredResults.length
        ? featuredResults.join(", ")
        : "No Legendary Exclusive featured characters yet.";
}
