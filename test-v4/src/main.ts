import "./style.css";
import { YOUTUBE_key } from "../env.js";

console.log(YOUTUBE_key);

const search_button = document.getElementById("search_button");
const searchUrl = "https://www.googleapis.com/youtube/v3/search?";
const videoEmbedUrl = "https://www.youtube.com/embed/";
const app = document.getElementById("app");

const params = {
  q:"",
  key: YOUTUBE_key,
  part: "snippet",
  type: "video",
  maxResults: 1,
  videoEmbeddable: true
};

if (search_button)
  search_button.addEventListener("click", callApiGetSearch, false);

async function callApiGetSearch() {
  params.q = "nirvana";
  const body = await fetch(searchUrl + new URLSearchParams(params));
  const response = await body.json();
  embedVideo(response)

  console.log("response--", response);
}

const embedVideo = (response) => {
  const video = response.items[0];
  const videoId = video.id.videoId;
  const snippet = video.snippet;
  const videoTitle = snippet.title;
  const videoDescription = snippet.description;
  const videoThumbnail = snippet.medium; //default|medium|high
  // const videoChannelTitle = snippet.channelTitle;
  // const videoPublishTime = snippet.publishTime;

  const iframe = document.createElement("iframe");
  iframe.src = videoEmbedUrl + videoId;
  iframe.width =  "560";
  iframe.height =  "360";
  iframe.frameBorder =  "0";
  iframe.allowFullscreen =  true;
  iframe.title =  videoTitle;

  const title = document.createElement("h3");
  title.textContent = videoTitle

  const description = document.createElement("p");
  description.textContent = videoDescription;

  app?.append(iframe)
  app?.append(title)
  app?.append(description)


} ;

