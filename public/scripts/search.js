function getQuery() {
    const parts = window.location.pathname.split("/");
    const query = parts[2];

    return query ? decodeURIComponent(query) : "";
}

const query = getQuery();
console.log(query);

async function search() {
    if(!query) return;

    const res = await fetch(`/api/search/${encodeURIComponent(query)}`);
    const data = await res.json();

    console.log(data);
}

search();