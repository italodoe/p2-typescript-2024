import "./style.css";
// import typescriptLogo from './typescript.svg'

(function () {
  const tendingUrl = "https://api.giphy.com/v1/gifs/trending?";
  const searchUrl = "https://api.giphy.com/v1/gifs/search?";
  var query;

  const params = {
    //  q: query, //for search
    // rating: pg, //rating: g, pg, pg-13
    // offset: pg, //Default: “0” Maximum: “4999”
    limit: 10,
    api_key: "W93mPxjWAmjil8zKG0ZuBiaj3Pi8DRiO",
    fmt: "json",
    bundle: "messaging_non_clips",
  };

  // get trendings
  const trending_button = document.getElementById("trending_button");
  if (trending_button)
    trending_button.addEventListener("click", getTrending, false);

  async function callApiGetTrending() {
    delete params.q;
    const body = await fetch(tendingUrl + new URLSearchParams(params));
    const response = await body.json();
    console.log("response--", response);
  }

  function getTrending() {
    callApiGetTrending();
  }

  // get by search
  const search_button = document.getElementById("search_button");
  if (search_button)
    search_button.addEventListener("click", getSearch, false);

  async function callApiGetSearch() {
    params.q = "rick and morty";
    const body = await fetch(searchUrl + new URLSearchParams(params));
    const response = await body.json();
    console.log("response--", response);
  }

  function getSearch() {
    callApiGetSearch();
  }



})();
