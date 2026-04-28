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
    console.log("Page loaded!");
    let user = new User();
})