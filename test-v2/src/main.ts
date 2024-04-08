import "./style.css";
// import typescriptLogo from './typescript.svg'

(function () {
  const tendingUrl = "https://api.giphy.com/v1/gifs/trending?";
  const searchUrl = "https://api.giphy.com/v1/gifs/search?";
  const inputSearch = document.getElementById("search_input");
  const app = document.getElementById("app");
  const offsetMinMax = { min: 0, max: 49999 };

  const randomBetween = (from: number, to: number) => {
    return Math.floor(Math.random() * (to - from + 1) + from);
  };

  const params = {
    q: null, //for search
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
    return response;
    console.log("response--", response);
  }

  async function getTrending(e: Event) {
    e.preventDefault();

    const trends = await callApiGetTrending();
    render(trends, true);
  }

  // get by search
  const search_button = document.getElementById("search_button");
  if (search_button) search_button.addEventListener("click", getSearch, false);

  async function callApiGetSearch(search_term: string, callback: any) {
    params.q = search_term;
    const body = await fetch(searchUrl + new URLSearchParams(params));
    const response = await body.json();
    console.log("response--", response);
    if (response && callback) callback(response);
  }

  function getSearch(e: Event) {
    e.preventDefault();
    const search_term = inputSearch?.value;
    if (search_term !== "") callApiGetSearch(search_term, render);
  }

  const render = (response, clean: boolean = false) => {
    console.log(response);
    const limit = response.data.length;
    if (clean) app.textContent = "";

    for (let i = 0; i < limit; ++i) {
      console.log("response.data", response.data[i].images);
      let img = document.createElement("img");
      img.src = response.data[i].images.fixed_height.url;
      app?.appendChild(img);
    }
  };
})();
