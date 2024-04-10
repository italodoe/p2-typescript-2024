import "./style.css";
import {RapidAPI_Key} from "../env.js";


console.log(RapidAPI_Key); 

const searchUrl = "https://tastedive.com/api/similar?";
const search_button = document.getElementById("search_button");

if (search_button)
  search_button.addEventListener("click", callApiGetSearch, false);

async function callApiGetSearch() {
  const url =
    "https://youtube-v3-alternative.p.rapidapi.com/video?id=dQw4w9WgXcQ";

  const payload = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": RapidAPI_Key,
      "X-RapidAPI-Host": "youtube-v3-alternative.p.rapidapi.com",
    },
  };

  const body = await fetch(url, payload);
  const response = await body.json();



  console.log("response--", response);
}
