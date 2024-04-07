import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";

//https://developer.spotify.com/dashboard/
const clientId = "3230f41bc16748eb954abe9313db72aa";
const clientSecret = "37a24864fdae4aa0a538460df473796d";

const redirectUri = "http://localhost:5173/";

const scope = "user-read-private user-read-email";
const authUrl = new URL("https://accounts.spotify.com/authorize");

const tokenUrl = "https://accounts.spotify.com/api/token";


const access_token = localStorage.getItem("access_token") || null;
const refresh_token = localStorage.getItem("refresh_token") || null;
const expires_at = localStorage.getItem("expires_at") || null;

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code") || null;

// code example
//https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow 

(function () {
  //code verification
  const generateRandomString = (length: number) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input: ArrayBufferLike) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  async function generateCodeChanllenge(codeVerifier: string) {
    const hashed = await sha256(codeVerifier);
    return base64encode(hashed);
  }

  // login button
  document.addEventListener("click", spotifyAuthorize, false);

  function spotifyAuthorize(e: Event) {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = generateCodeChanllenge(codeVerifier);

    window.localStorage.setItem("code_verifier", codeVerifier);

    const params = {
      response_type: "code",
      client_id: clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    };
    authUrl.search = new URLSearchParams(params).toString();
    console.log(authUrl.toString());
    window.location.href = authUrl.toString();
  }

  const getToken = async (code: string) => {
    // stored in the previous step
    let codeVerifier = localStorage.getItem("code_verifier");

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    };

    const body = await fetch(tokenUrl, payload);
    const response = await body.json();

    console.log(response);

    localStorage.setItem("access_token", response.access_token);
  };


  console.log("code", code);
  console.log("access_token", access_token);
  console.log("refresh_token", refresh_token);
  console.log("expires_at", expires_at);
})();
