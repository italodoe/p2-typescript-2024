import "./style.css";
import { YOUTUBE_key } from "./env.ts";

var isIntervalActive;
var videoBgArrayIndex: number[] = [];
const localKeyArray: string[] = [];
var ytItemsArray: JSON[] = [];
const ytMaxCalls = 5; //max reloads for the same query  

//header effects
const changeBackgroundVideo = setInterval(() => {
  isIntervalActive = true;
  const videoBg = document.getElementById("header_back_video");
  const videoSource = videoBg?.dataset.source;
  const videoMaxIndex = videoBg?.dataset.maxindex;

  if (videoMaxIndex) {
    if (videoBgArrayIndex.length === 0)
      videoBgArrayIndex = Array.from(Array(parseInt(videoMaxIndex)).keys());
    videoBgArrayIndex.sort(() => 0.5 - Math.random());
    videoBg.src = videoSource + String(videoBgArrayIndex.pop()) + ".mp4";
    console.log("changeBackgroundVideo", videoBg.src);
  }
}, 6000);

function setSearchedFlag() {
  const searchClassName = "searched";
  const bg = document.getElementById("header_back_wrapper");
  bg?.classList.add(searchClassName);
}

/**
 * Youtube
 */
const search_form = document.getElementById("search_form");
const search_button = document.getElementById("search_button");
const search_input = document.getElementById("search_input");
const youtubeSearchUrl = "https://www.googleapis.com/youtube/v3/search?";
const videoEmbedUrl = "https://www.youtube.com/embed/";
const app = document.getElementById("app");

//global params
const yt_params = {
  q: "",
  key: YOUTUBE_key,
  part: "snippet",
  type: "video",
  maxResults: 10,
  videoEmbeddable: true,
  pageToken: undefined,
};
localKeyArray.push("q");
localKeyArray.push("next_page_token");
localKeyArray.push("max_token_call");

if (search_form) search_form.addEventListener("submit", searchHandler, false);

async function searchHandler(e: Event) {
  console.log(e);
  e.preventDefault();
  const _q = search_input?.value;
  search(_q);
}

async function search(q = null) {
  let _q: string;
  if (q) {
    clearLocalStorage();
    _q = q;
  } 
  else {
    _q = getLocalStorageItem("q");
  }
  const maxTokenCall = getLocalStorageItem("max_token_call");
  let _maxTokenCallInt = maxTokenCall ? parseInt(maxTokenCall) : -1;

  if (_q && (ytMaxCalls >= _maxTokenCallInt)) {
    console.log('inside');
    yt_params.q = _q;
    delete yt_params.pageToken;
    const _nextPageToken = getLocalStorageItem("next_page_token");

    let clear = true;
    if (_nextPageToken) {
      yt_params.pageToken = _nextPageToken;
      clear = false;
    }
    const response = await youtubeSearchApi();
    //todo check response
    setLocalStorageItem("next_page_token", response.nextPageToken);
    setLocalStorageItem("q", _q);
    setLocalStorageItem("max_token_call", ++_maxTokenCallInt);
    addThumbnails(response.items, clear);
    return true;
  }
  return false;
}

async function youtubeSearchApi() {
  const body = await fetch(youtubeSearchUrl + new URLSearchParams(yt_params));
  const response = await body.json();
  console.log("response--", response);
  return response;
}

const addThumbnails = (items: Array<JSON>, clear = true) => {
  console.log("addThumbnails", items);

  const itemsArray = (ytItemsArray = items);
  if (clear) clearApp();

  itemsArray.forEach(function (video, index) {
    console.log(video, index);
    const videoId = video.id.videoId;
    const snippet = video.snippet;
    const videoTitle = snippet.title;
    const videoDescription = snippet.description;
    const videoThumbnail = snippet.thumbnails.medium.url; //default|medium|high
    // const videoChannelTitle = snippet.channelTitle;
    // const videoPublishTime = snippet.publishTime;
    console.log(videoThumbnail);
    const div = document.createElement("div");
    div.className = "yt-thumbnail-wrapper";

    const a = document.createElement("a");
    a.className = "yt-thumbnail";
    a.href = videoEmbedUrl + videoId;

    const img = document.createElement("img");
    img.src = videoThumbnail;
    img.title = videoTitle;

    const title = document.createElement("h3");
    title.textContent = videoTitle;

    const divBg = document.createElement("div");
    divBg.className = "yt-thumbnail-bg";

    a.append(img);
    a.append(title);
    div.append(a);
    div.append(divBg);
    app?.append(div);

    setSearchedFlag();
  });
};

function embed(video) {
  const iframe = document.createElement("iframe");
  const videoId = video.id.videoId;
  const snippet = video.snippet;
  const videoTitle = snippet.title;
  const videoDescription = snippet.description;

  iframe.src = videoEmbedUrl + videoId;
  iframe.width = "560";
  iframe.height = "360";
  iframe.frameBorder = "0";
  iframe.allowFullscreen = true;
  iframe.title = videoTitle;

  const title = document.createElement("h3");
  title.textContent = videoTitle;

  const description = document.createElement("p");
  description.textContent = videoDescription;

  app?.append(iframe);
  app?.append(title);
  app?.append(description);
}

function clearApp() {
  if (app) app.textContent = "";
}
(function () {
  clearLocalStorage();
  changeBackgroundVideo;
})();

/**
 * Infinity Scroll
 */
window.addEventListener("scroll", infinityScrollHandler, false);

async function infinityScrollHandler(e){
  const { clientHeight, scrollHeight, scrollTop } = document.documentElement;
  console.log({ clientHeight, scrollHeight, scrollTop });
  const offset = 2; //px
  if (scrollTop + clientHeight > scrollHeight - offset) {
    const copyright_sym = document.getElementById("copyright_sym");
    copyright_sym?.classList.add("searching");
    const finished = await search();
    console.log("finished", finished);
    copyright_sym?.classList.remove("searching");
  }
}


/**
 * Local Storage Management
 */

function setLocalStorageItem(key: string, value: any) {
  window.localStorage.setItem(key, value);
}

function getLocalStorageItem(key: string) {
  return localStorage.getItem(key);
}

function clearLocalStorage(all = false, key = null) {
  console.log(localKeyArray);

  if (all) localStorage.clear();
  else {
    if (key) localStorage.removeItem(key);
    else {
      localKeyArray.forEach((item) => localStorage.removeItem(item));
    }
  }
}
