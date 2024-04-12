import "./style.css";
import { YOUTUBE_key } from "./env.ts";
var interval;
var isIntervalActive;
var videoBgArrayIndex: number[] = [];

//header effects
const changeBackgroundVideo = () => {
  interval = setInterval(() => {
    isIntervalActive = true;
    const videoBg = document.getElementById("header_back_video");
    const videoSource = videoBg?.dataset.source;
    const videoMaxIndex = videoBg?.dataset.maxindex;

    if (videoMaxIndex) {
      if (videoBgArrayIndex.length === 0)
        videoBgArrayIndex = Array.from(Array(parseInt(videoMaxIndex)).keys());
      videoBgArrayIndex.sort(() => 0.5 - Math.random());
      videoBg.src = videoSource + String(videoBgArrayIndex.pop()) + ".mp4";
      console.log(videoBg.src);
    }
  }, 8000);
};

function setSearchedFlag() {
  const searchClassName = "searched";
  const bg = document.getElementById("header_back_wrapper");
  bg?.classList.add(searchClassName);
}

//youtube
const search_form = document.getElementById("search_form");
const search_button = document.getElementById("search_button");
const search_input = document.getElementById("search_input");
const youtubeSearchUrl = "https://www.googleapis.com/youtube/v3/search?";
const videoEmbedUrl = "https://www.youtube.com/embed/";
const app = document.getElementById("app");

const yt_params = {
  q: "",
  key: YOUTUBE_key,
  part: "snippet",
  type: "video",
  maxResults: 50,
  videoEmbeddable: true,
  pageToken: undefined,
};

if (search_form) search_form.addEventListener("submit", searchHandler, false);

async function searchHandler(e: Event) {
  console.log(e);
  e.preventDefault();
  yt_params.q = search_input?.value;
  const response = await youtubeSearchApi();
  const nextPageToken = response.nextPageToken;
  const response2 = await youtubeSearchApi(nextPageToken);
  console.log("response2", response2);
  addThumbnails(response);
  addThumbnails(response2, false);
}

async function youtubeSearchApi(nextPageToken = null) {
  delete yt_params.pageToken;
  if (nextPageToken) {
    yt_params.pageToken = nextPageToken;
  }
  const body = await fetch(youtubeSearchUrl + new URLSearchParams(yt_params));
  const response = await body.json();
  console.log("response--", response);

  return response;
}

const addThumbnails = (response, clear = true) => {
  const itemsArray = response.items;
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

changeBackgroundVideo();
