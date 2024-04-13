import "./style.css";
import { YOUTUBE_key } from "./env.ts";
import { AppManagement } from "./appmanagement.ts";
import { YoutubeSearchResult } from "./youtubemodel.ts";
import { YoutubeService } from "./youtubemodel.ts";
import { LocalStorageManagement } from "./localstoragemanagement.ts";

var isIntervalActive;
var videoBgArrayIndex: number[] = [];
var ytSearchCollection: YoutubeSearchResult[] = [];
const ytMaxCalls = 5; //max reloads for the same query
var currentTimeOffset = 0;
const localKeyArray: string[] = [];
localKeyArray.push("q");
localKeyArray.push("next_page_token");
localKeyArray.push("max_token_call");

const app = document.getElementById("app");
const App = new AppManagement(app);
const LocalStorage = new LocalStorageManagement(localKeyArray);
const YoutubeSrv = new YoutubeService({
  q: "",
  key: YOUTUBE_key,
  part: "snippet",
  type: "video",
  maxResults: 10,
  videoEmbeddable: true,
  pageToken: undefined,
});

//header effects
const changeBackgroundVideo = setInterval(() => {
  isIntervalActive = true;
  const videoBg = document.getElementById("header_back_video");
  const videoSource = videoBg?.dataset.source;
  const videoMaxIndex = videoBg?.dataset.maxindex;

  if (videoMaxIndex) {
    if (videoBgArrayIndex.length === 0) {
      videoBgArrayIndex = Array.from(Array(parseInt(videoMaxIndex)).keys());
      videoBgArrayIndex.sort(() => 0.5 - Math.random());
      currentTimeOffset += 2;
      if (currentTimeOffset > 20) currentTimeOffset = 0;
    }
    videoBg.src = videoSource + String(videoBgArrayIndex.pop()) + ".mp4";
    videoBg.currentTime = currentTimeOffset;
    console.log("changeBackgroundVideo", videoBg.src);
    console.log(videoBgArrayIndex);
  }
}, 6000);

(function () {
  LocalStorage.clearLocalStorage();
  changeBackgroundVideo;
})();

// function setSearchedFlag() {
//   const searchClassName = "searched";
//   const bg = document.getElementById("header_back_wrapper");
//   bg?.classList.add(searchClassName);
// }

/**
 * Youtube
 */
const search_form = <HTMLFormElement>document.getElementById("search_form");
// const search_button = document.getElementById("search_button");
const search_input = <HTMLInputElement>document.getElementById("search_input");
// const youtubeSearchUrl = "https://www.googleapis.com/youtube/v3/search?";

//global params
// const yt_params = {
//   q: "",
//   key: YOUTUBE_key,
//   part: "snippet",
//   type: "video",
//   maxResults: 10,
//   videoEmbeddable: true,
//   pageToken: undefined,
// };

if (search_form) search_form.addEventListener("submit", searchHandler, false);

async function searchHandler(e: Event) {
  console.log(e);
  e.preventDefault();
  const _q = search_input?.value;
  if (_q){
    App.clear();
    YoutubeSrv.search(App, LocalStorage, _q)
  }

  // search(_q);
}



// async function youtubeSearchApi() {
//   const body = await fetch(youtubeSearchUrl + new URLSearchParams(yt_params));
//   const response = await body.json();
//   console.log("response--", response);
//   return response;
// }

/*
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
}*/

/**
 * Infinity Scroll
 */
window.addEventListener("scroll", infinityScrollHandler, false);

async function infinityScrollHandler(e) {
  const { clientHeight, scrollHeight, scrollTop } = document.documentElement;
  console.log({ clientHeight, scrollHeight, scrollTop });
  const offset = 2; //px
  if (scrollTop + clientHeight > scrollHeight - offset) {
    const copyright_sym = document.getElementById("copyright_sym");
    copyright_sym?.classList.add("searching");
    const finished = await     YoutubeSrv.search(App, LocalStorage);
    console.log("finished", finished);
    copyright_sym?.classList.remove("searching");
  }
}
