import "./style.css";
import { YOUTUBE_key } from "./env.ts";

//youtube 
const search_button = document.getElementById("search_button");
const ytSearchUrl = "https://www.googleapis.com/youtube/v3/search?";
const ytVideoEmbedUrl = "https://www.youtube.com/embed/";
const app = document.getElementById("app");

const yt_params = {
  q:"",
  key: YOUTUBE_key,
  part: "snippet",
  type: "video",
  maxResults: 1,
  videoEmbeddable: true
};

if (search_button)
  search_button.addEventListener("click", searchHandler, false);

function searchHandler(e: Event){
  e.preventDefault;
}