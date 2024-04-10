import "./style.css";
import { YOUTUBE_key } from "../env.js";

console.log(YOUTUBE_key);

const search_button = document.getElementById("search_button");
const searchUrl = "https://www.googleapis.com/youtube/v3/search?";
const params = {
  q:"",
  key: YOUTUBE_key,
  part: "snippet",
  type: "video",
  maxResults: 1,
  videoEmbeddable: true
};

if (search_button)
  search_button.addEventListener("click", callApiGetSearch, false);

async function callApiGetSearch() {
  params.q = "nirvana";
  const body = await fetch(searchUrl + new URLSearchParams(params));
  const response = await body.json();


  console.log("response--", response);
}

