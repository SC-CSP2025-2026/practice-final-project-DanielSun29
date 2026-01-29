const url =
  "https://student-api-proxy.onrender.com/api/wft-geo-db.p.rapidapi.com/v1/geo/countries";
const options = {
  method: "GET",
  headers: {
    "X-API-Key":
      "f8827a7aa2895b3692a2d945c39faa2b58cf4069dc43c60ea8be9897c7d931ab",
  },
};

fetch(url, options)
  .then((response) =>
    response.json().then((result) => {
      console.log(result.data); // Your API data
      console.log(`Cost: $${result.meta.cost}`);
      console.log(`Remaining: $${result.meta.remaining_budget}`);
    }),
  )
  .catch((error) => {
    console.log(error);
  });
