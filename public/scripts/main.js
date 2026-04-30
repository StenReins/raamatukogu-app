import { User } from "./user.js";

function handleSearch() {
    document.getElementById("search-form").addEventListener("submit", (e) => {
        e.preventDefault()

        const query = document.getElementById("search").value.trim();
        if (!query) return;

        window.location.href= `/search/${encodeURIComponent(query)}`
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    handleSearch();
    handleAddShelfModal();
    renderCustomShelves();
    console.log("Page loaded!");
    let user = new User();
})

function handleAddShelfModal() {
    const openButton = document.getElementById("open-shelf-modal");
    const closeButton = document.getElementById("close-shelf-modal");
    const modal = document.getElementById("add-shelf-modal");
    const form = document.getElementById("add-shelf-form");
    const input = document.getElementById("shelf-name");

    if (!openButton || !closeButton || !modal || !form || !input) {
        return;
    }

    openButton.addEventListener("click", () => {
        modal.classList.add("active");
        input.focus();
    });

    closeButton.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.remove("active");
        }
    });

   form.addEventListener("submit", (event) => {
    event.preventDefault();

    const shelfName = input.value.trim();

    if (!shelfName) {
        return;
    }

    const shelfList = document.getElementById("shelf-list");

    if (!shelfList) {
        return;
    }

    const newShelf = document.createElement("a");
    newShelf.classList.add("shelf-tab");
    newShelf.href = "#";
    newShelf.textContent = shelfName;

    shelfList.appendChild(newShelf);

    const shelves = getCustomShelves();
    shelves.push(shelfName);
    saveCustomShelves(shelves);

    input.value = "";
    modal.classList.remove("active");
});
}
function getCustomShelves() {
    const savedShelves = localStorage.getItem("customShelves");

    if (!savedShelves) {
        return [];
    }

    return JSON.parse(savedShelves);
}

function saveCustomShelves(shelves) {
    localStorage.setItem("customShelves", JSON.stringify(shelves));
}

function renderCustomShelves() {
    const shelfList = document.getElementById("shelf-list");

    if (!shelfList) {
        return;
    }

    const shelves = getCustomShelves();

    shelves.forEach((shelfName) => {
        const newShelf = document.createElement("a");
        newShelf.classList.add("shelf-tab");
        newShelf.href = "#";
        newShelf.textContent = shelfName;

        shelfList.appendChild(newShelf);
    });
}