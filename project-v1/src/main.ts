import "./style.css";
import { YOUTUBE_key } from "./env.ts";

//youtube
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
  maxResults: 10,
  videoEmbeddable: true,
};

if (search_button)
  search_button.addEventListener("click", searchHandler, false);

async function searchHandler(e: Event) {
  e.preventDefault;
  yt_params.q = search_input?.value;
  const response = await youtubeSearchApi();
  addThumbnails(response);
}

async function youtubeSearchApi() {
  const body = await fetch(youtubeSearchUrl + new URLSearchParams(yt_params));
  const response = await body.json();
  console.log("response--", response);
  return response;
}

const addThumbnails = (response) => {
  const itemsArray = response.items;

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
    const a = document.createElement("a");
    a.className = "yt-thumbnail";
    a.href = videoEmbedUrl + videoId;

    const img = document.createElement("img");
    img.src = videoThumbnail;
    img.title = videoTitle;

    const title = document.createElement("h3");
    title.textContent = videoTitle;

    a.append(img);
    a.append(title);
    app?.append(a);
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
