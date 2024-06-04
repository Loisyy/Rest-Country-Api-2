const searchBar = document.querySelector(".search-bar");
const searchButton = document.querySelector("#search-button");
const result = document.querySelector(".output");
const regionFilter = document.querySelector(".region-filter");

// Fetch all countries on page load
window.addEventListener("load", () => {
  fetchCountries("all");
});

searchButton.addEventListener("click", () => {
  const query = searchBar.value.trim();
  fetchCountries(query);
});

regionFilter.addEventListener("change", () => {
  const region = regionFilter.value;
  fetchCountries(region === "all" ? "" : region, true);
});

function fetchCountries(query, isRegion = false) {
  let url;
  if (isRegion) {
    url = `https://restcountries.com/v3.1/region/${query}`;
  } else {
    url = query
      ? `https://restcountries.com/v3.1/name/${query}`
      : `https://restcountries.com/v3.1/all`;
  }

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok " + res.statusText);
      }
      return res.json();
    })
    .then((data) => displayCountry(data));
}

const displayCountry = (data) => {
  result.innerHTML = ""; // Clear previous results
  if (!data || data.status === 404) {
    alert("Country not found");
    return;
  }
  data.forEach((country) => {
    const div = document.createElement("div");
    div.className = "col-md-3 col-sm-6 col-12 card d-flex shadow";
    div.style.width = "18rem";
    div.innerHTML = `
      <img src="${country.flags.png}" class="card-img-top" alt="...">
      <div class="card-body">
          <h2 class="card-text">${
            country.translations.bre
              ? country.translations.bre.common
              : country.name.common
          }</h2>
      </div>
    `;
    div.addEventListener("click", () => showDetails(country)); // Add click event listener
    result.appendChild(div);
  });
};

const showDetails = (country) => {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  // Create a modal or detailed view to show more information about the country
  const detailDiv = document.createElement("div");
  detailDiv.className = "country-detail";
  detailDiv.innerHTML = `
    <h2>${
      country.translations.bre
        ? country.translations.bre.common
        : country.name.common
    }</h2>
    <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
    <p><strong>Capital:</strong> ${
      country.capital ? country.capital[0] : "N/A"
    }</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Subregion:</strong> ${country.subregion}</p>
    <p><strong>Population:</strong> ${country.population}</p>
    <p><strong>Languages:</strong> ${Object.values(country.languages).join(
      ", "
    )}</p>
    <p><strong>Border Countries:</strong> ${
      country.borders
        ? country.borders
            .map((border) => `<a href="#">${border}</a>`)
            .join(", ")
        : "N/A"
    }</p>
    <button class="btn btn-secondary" id="close-detail">Close</button>
  `;

  // Append overlay and detailDiv to the body
  document.body.appendChild(overlay);
  document.body.appendChild(detailDiv);

  // Add event listener to close the detail view and remove overlay
  document.querySelector("#close-detail").addEventListener("click", () => {
    document.body.removeChild(detailDiv);
    document.body.removeChild(overlay);
  });

  // Close the modal when clicking outside of it
  overlay.addEventListener("click", () => {
    document.body.removeChild(detailDiv);
    document.body.removeChild(overlay);
  });

  // Handle click on border countries
  detailDiv.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      fetchCountries(link.textContent, true);
      document.body.removeChild(detailDiv);
      document.body.removeChild(overlay);
    });
  });
};
