import "./style.css";

const clientId =
  "IjOQ1jqu0XIf6WrpH5VLL66AoGVND9VIVcYcnDVAkdqDsUkrAb3dPWxouEIsYU-z";
const clientSecret =
  "YrR9bbq8QGJqiwrfaO7iluYTtF7bHljXx-oXG65kLAMrzNJ5U_3_JN28JmMHlAS7vRC9e1-fgmoHRQn5AMrdDA";
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

  console.log(searchUrl + params);

  const response = await fetch(searchUrl + params, {
     headers: {
      Authorization: "Bearer " + authToken,
    },
  });

  const data = await response.json();
  console.log(data);
}

// const authHeaders = {
//   "Content-Type": "application/x-www-form-urlencoded",
//   Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
// };
// const authData = {
//   grant_type: "client_credentials",
// };
// const authToken = await fetch(authUrl, {
//   method: "POST",
//   headers: authHeaders,
//   body: new URLSearchParams(authData),
// })
//   .then((response) => response.json())
//   .then((data) => data.access_token);

// const searchTerm = "Kendrick Lamar";
// const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(
//   searchTerm
// )}`;
// const searchHeaders = {
//   Authorization: `Bearer ${authToken}`,
// };
// const searchResults = await fetch(searchUrl, {
//   headers: searchHeaders,
// })
//   .then((response) => response.json())
//   .then((data) => data.response.hits);
// console.log(searchResults);
