import "./style.css";
import { GENIUS_clientId, GENIUS_clientSecret } from "../env.js";

const clientId = GENIUS_clientId;
const clientSecret = GENIUS_clientSecret;
// const accessToken = 'rfsEJ1Qd8Xkr3RF3mo8Zz4VA0VoVn-KNGraoeBsVpUmkBXp-meIM6iWB5F0F8qeG';
const authUrl = "https://api.genius.com/oauth/token";

// search button
const search_button = document.getElementById("search_button");
if (search_button) search_button.addEventListener("click", serchAll, false);

async function getGeiniusAuthorize() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", "http://localhost:5173/");
  params.append("response_type", "code");

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  };
  console.log(authUrl);
  console.log(payload);
  const body = await fetch(authUrl, payload);
  const response = await body.json();
  console.log(response);

  localStorage.setItem("access_token", response.access_token);
  return response.access_token;
}

async function serchAll() {
  let authToken = localStorage.getItem("access_token");
  console.log(authToken);

  if (!authToken) {
    authToken = await getGeiniusAuthorize();
    console.log(authToken);
  }
  const searchTerm = "Kendrick Lamar";
  const searchUrl = `https://api.genius.com/search?`;
  const params = new URLSearchParams();
  params.append("q", searchTerm);
  params.append("access_token", String(authToken));

  console.log(searchUrl + params);

  const response = await fetch(searchUrl + params);

  const data = await response.json();
  console.log(data);
}