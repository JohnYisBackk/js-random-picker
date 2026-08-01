"use strict";

window.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
});

// ===============================
// 1. SELECT ELEMENTS
// ===============================

const addInput = document.getElementById("addInput");
const addBtn = document.getElementById("addBtn");

const removeWinnerToggle = document.getElementById("removeWinnerToggle");
const animationToggle = document.getElementById("animationToggle");

const totalItems = document.getElementById("totalItems");
const totalPicks = document.getElementById("totalPicks");

const pickerLabel = document.getElementById("pickerLabel");
const winnerName = document.getElementById("winnerName");
const pickerDescription = document.getElementById("pickerDescription");
const pickBtn = document.getElementById("pickBtn");
const pickAgainBtn = document.getElementById("pickAgainBtn");
const availableItems = document.getElementById("availableItems");
const lastWinner = document.getElementById("lastWinner");

const searchInput = document.getElementById("searchInput");

const shuffleBtn = document.getElementById("shuffleBtn");
const clearBtn = document.getElementById("clearBtn");

const itemsList = document.getElementById("itemsList");

// ===============================
// 2. STATE
// ===============================

let items = [];

let totalPicksCount = 0;

let lastPickedItem = null;

// ===============================
// 3. SAVE / LOAD DATA
// ===============================

function saveData() {
  localStorage.setItem("randomPicker", JSON.stringify(items));
}

function loadData() {
  const storedItems = localStorage.getItem("randomPicker");

  if (!storedItems) return;

  items = JSON.parse(storedItems);
}

// ===============================
// 4. ADD ITEM
// ===============================

function addItem() {
  const itemValue = addInput.value.trim();

  if (!itemValue) return;

  const item = {
    id: Date.now(),
    name: itemValue,
    favorite: false,
  };

  items.push(item);

  saveData();
  renderItems();

  addInput.value = "";
  addInput.focus();
}

// ===============================
// 5. DELETE ITEM
// ===============================

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);

  saveData();
  renderItems();
}

// ===============================
// 6. TOGGLE FAVORITE
// ===============================

function toggleItem(id) {
  const toggledItem = items.find((item) => item.id === id);

  if (!toggledItem) return;

  toggledItem.favorite = !toggledItem.favorite;

  saveData();
  renderItems();
}

// ===============================
// 7. SEARCH ITEMS
// ===============================

function searchItems(itemList) {
  const searchValue = searchInput.value.toLowerCase().trim();

  if (!searchValue) return itemList;

  return itemList.filter((item) =>
    item.name.toLowerCase().includes(searchValue),
  );
}

// ===============================
// 8. PICK RANDOM ITEM
// ===============================

function pickRandomItem() {
  if (items.length === 0) return;

  const randomIndex = Math.floor(Math.random() * items.length);
  const pickedItem = items[randomIndex];

  if (animationToggle.checked) {
    runPickAnimation(pickedItem);
  } else {
    showWinner(pickedItem);
  }
}

function runPickAnimation(pickedItem) {
  pickBtn.disabled = true;
  pickAgainBtn.disabled = true;

  pickerLabel.textContent = "Picking...";
  pickerDescription.textContent = "Let fate decide the winner.";

  let animationCount = 0;

  const animationInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];

    winnerName.textContent = randomItem.name;

    winnerName.classList.remove("winner-pop");
    void winnerName.offsetWidth;
    winnerName.classList.add("winner-pop");

    animationCount++;

    if (animationCount >= 18) {
      clearInterval(animationInterval);

      setTimeout(() => {
        showWinner(pickedItem);

        pickBtn.disabled = false;
        pickAgainBtn.disabled = false;
      }, 250);
    }
  }, 90);
}

function showWinner(pickedItem) {
  lastPickedItem = pickedItem;
  totalPicksCount++;

  pickerLabel.textContent = "Winner is...";
  winnerName.textContent = pickedItem.name;
  pickerDescription.textContent = "The random picker selected this item.";

  pickAgainBtn.hidden = false;

  winnerName.classList.remove("winner-pop");
  void winnerName.offsetWidth;
  winnerName.classList.add("winner-pop");

  if (removeWinnerToggle.checked) {
    items = items.filter((item) => item.id !== pickedItem.id);

    saveData();
    renderItems();
  }

  updateStats();
}

// ===============================
// 9. SHUFFLE ITEMS
// ===============================

function shuffleItems() {
  items.sort(() => Math.random() - 0.5);

  saveData();
  renderItems();
}

// ===============================
// 10. CLEAR ALL ITEMS
// ===============================

function clearAllItems() {
  const isConfirmed = confirm("Are you sure you want to delete all items?");

  if (!isConfirmed) return;

  items = [];
  winnerName.textContent = "Add items and let fate decide";

  saveData();
  renderItems();
}

// ===============================
// 11. UPDATE STATISTICS
// ===============================

function updateStats() {
  totalItems.textContent = items.length;
  totalPicks.textContent = totalPicksCount;
  availableItems.textContent = items.length;

  lastWinner.textContent = lastPickedItem ? lastPickedItem.name : "None";
}

// ===============================
// 12. UPDATE PICKER STATE
// ===============================

function updatePickerState() {
  winnerName.textContent =
    items.length === 0
      ? "Add items and let fate decide"
      : "Click the button below";

  pickAgainBtn.hidden = true;
}

// ===============================
// 13. RENDER ITEMS
// ===============================

function renderItems() {
  const visibleItems = searchItems(items);

  itemsList.innerHTML = "";

  updateStats();

  if (visibleItems.length === 0) {
    itemsList.innerHTML = `
     <div class="empty-state" id="emptyState">
        <i data-lucide="inbox"></i>
        <h3>No items yet</h3>
        <p>Start by adding your first item to the list.</p>
      </div>
    `;

    lucide.createIcons();
    return;
  }

  visibleItems.forEach((item) => {
    const itemCard = document.createElement("article");

    itemCard.classList.add("item-card");

    if (item.favorite) {
      itemCard.classList.add("favorite");
    }

    itemCard.innerHTML = `
      <div class="item-card-info">
        <span class="item-dot"></span>
        <h3>${item.name}</h3>
      </div>

      <div class="item-actions">
        <button
          type="button"
          class="favorite-item-btn ${item.favorite ? "active" : ""}"
          onclick="toggleItem(${item.id})"
          aria-label="Toggle favorite"
        >
          <i data-lucide="star"></i>
        </button>

        <button
          type="button"
          class="delete-item-btn"
          onclick="deleteItem(${item.id})"
          aria-label="Delete item"
        >
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;

    itemsList.appendChild(itemCard);
  });

  lucide.createIcons();
}

// ===============================
// 14. EVENT LISTENERS
// ===============================

addBtn.addEventListener("click", addItem);

addInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addItem();
  }
});

pickBtn.addEventListener("click", pickRandomItem);

pickAgainBtn.addEventListener("click", pickRandomItem);

searchInput.addEventListener("input", renderItems);

shuffleBtn.addEventListener("click", shuffleItems);

clearBtn.addEventListener("click", clearAllItems);

// ===============================
// 15. INITIALIZE APP
// ===============================

function initializeApp() {
  loadData();
  renderItems();
  updatePickerState();
}

initializeApp();
