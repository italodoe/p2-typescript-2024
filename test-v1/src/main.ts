import "./style.css";
// import typescriptLogo from "./typescript.svg";
// import viteLogo from "/vite.svg";

//https://developer.spotify.com/dashboard/
const clientId = "3230f41bc16748eb954abe9313db72aa";
// const clientSecret = "37a24864fdae4aa0a538460df473796d";

const redirectUri = "http://localhost:5173/";

const scope = "user-read-private user-read-email";

const authUrl = new URL("https://accounts.spotify.com/authorize");
const tokenUrl = "https://accounts.spotify.com/api/token";
const profileUrl = "https://api.spotify.com/v1/me";

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

  // login button
  const login_btn = document.getElementById("login_button");
  if (login_btn) login_btn.addEventListener("click", spotifyAuthorize, false);

  async function spotifyAuthorize() {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

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
    const codeVerifier = localStorage.getItem("code_verifier");
    if (codeVerifier) {
      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", redirectUri);
      params.append("code_verifier", codeVerifier);

      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      };

      const body = await fetch(tokenUrl, payload);
      const response = await body.json();

      setTokenResponse(response);

      console.log("getToken", response);
    }
  };

  const setTokenResponse = (response: {
    expires_in: number;
    access_token: string;
    refresh_token: string;
  }) => {
    const t = new Date();
    let expires_at = t.setSeconds(t.getSeconds() + response.expires_in);
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);
    localStorage.setItem("expires_at", String(expires_at));
  };

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code") || null;

  if (code) {
    getToken(code);
  }

  // Profile button
  const profile_btn = document.getElementById("profile_button");
  if (profile_btn) profile_btn.addEventListener("click", getProfile, false);

  async function getProfile() {
    let accessToken = localStorage.getItem("access_token");

    const response = await fetch(profileUrl, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    const data = await response.json();
    console.log(data);
  }

  //refresh token
  const refresh_button = document.getElementById("refresh_button");
  if (refresh_button)
    refresh_button.addEventListener("click", getRefreshToken, false);

  async function getRefreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", refreshToken);
      params.append("client_id", clientId);

      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      };
      const body = await fetch(tokenUrl, payload);
      const response = await body.json();

      setTokenResponse(response);

      console.log("getRefreshToken", response);
    }
  }

  console.log("code", code);
})();

function logout() {
  localStorage.clear();
  window.location.reload();
}
