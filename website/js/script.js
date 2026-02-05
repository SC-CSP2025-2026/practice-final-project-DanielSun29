const cityUrl =
  "https://student-api-proxy.onrender.com/api/wft-geo-db.p.rapidapi.com/v1/geo/cities";
const countryUrl =
  "https://student-api-proxy.onrender.com/api/wft-geo-db.p.rapidapi.com/v1/geo/countries";
const options = {
  method: "GET",
  headers: {
    "X-API-Key":
      "f8827a7aa2895b3692a2d945c39faa2b58cf4069dc43c60ea8be9897c7d931ab",
  },
};

let allCities = [];

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const citiesContainer = document.getElementById("citiesContainer");
const loadingDiv = document.getElementById("loading");

// Fetch cities from API
async function fetchCities(searchQuery = "") {
  try {
    citiesContainer.innerHTML = "";

    const countryParams = searchQuery
      ? `?namePrefix=${encodeURIComponent(searchQuery)}`
      : "?limit=10";
    const fullCountryUrl = countryUrl + countryParams;

    const countryResponse = await fetch(fullCountryUrl, options);
    const countryResult = await countryResponse.json();

    console.log(countryResult);
    const countryID = countryResult?.data?.data?.[0]?.wikiDataId || null;
    console.log(`Country ID: ${countryID}`);

    const cityParams = searchQuery
      ? `?countryIds=${countryID}&sort=-population&limit=10`
      : "?limit=10";
    const fullCityUrl = cityUrl + cityParams;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const cityResponse = await fetch(fullCityUrl, options);
    const result = await cityResponse.json();

    if (result.data?.data && result.data.data.length > 0) {
      allCities = result.data.data;
      displayCities(allCities);
      console.log(`Cost: $${result.meta.cost}`);
      console.log(`Remaining: $${result.meta.remaining_budget}`);
    } else {
      citiesContainer.innerHTML = '<div class="content">Not found</div>';
    }
  } catch (error) {
    console.error("Error fetching cities:", error);
    alert(
      "An error occurred while fetching city data. Please try again later.",
    );
  } finally {
    loadingDiv.style.display = "none";
  }
}

// Display cities as cards
function displayCities(cities) {
  citiesContainer.innerHTML = "";

  if (cities.length === 0) {
    citiesContainer.innerHTML = '<div class="content">No cities found.</div>';
    return;
  }

  cities.forEach((city) => {
    const card = document.createElement("div");
    card.className = "city-card";

    const population = city.population || "N/A";
    const type = city.type || "N/A";
    const region = city.region || "N/A";

    card.innerHTML = `
      <div class="city-name">${city.name}</div>
      <div class="row">
        <div class="col">
          <span class="city-info-label">Region:</span>
          <span class="city-info-value">${region}</span>
        </div>
        <div class="col">
          <span class="city-info-label">Population:</span>
          <span class="city-info-value">${population}</span>
        </div>
        <div class="col">
          <span class="city-info-label">Type:</span>
          <span class="city-info-value">${type}</span>
        </div>
      </div>
    `;

    citiesContainer.appendChild(card);
  });
}

// Search functionality
function handleSearch() {
  const input = searchInput.value.trim();
  loadingDiv.style.display = "block";
  for (const char of input) {
    if (!/[a-zA-Z\s]/.test(char)) {
      alert("Please enter only alphabetic characters and spaces.");
      return;
    }
  }
  fetchCities(input);
}

// Event listeners
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (key) => {
  if (key.key === "Enter") {
    handleSearch();
  }
});

// Load initial cities on page load
