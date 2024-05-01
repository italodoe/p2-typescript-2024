import fs from "fs";
import { YOUTUBE_key } from "./env";
const path = require("path");

export const usageText = `Usage: bun run main.ts [options]

Options:
  -y, --youtube <"term">      Search YouTube for videos related to the specified term
                               Enclose term in single or double quotes.
  -h, --help                  Display this help message.`;

export const searchUrl: string =
  "https://www.googleapis.com/youtube/v3/search?";
export const getCommentsUrl: string =
  "https://www.googleapis.com/youtube/v3/commentThreads?";

  export const maxN = 10;

  export var youtubeCommentsParams: YouTubeCommentsParams = {
    key: YOUTUBE_key,
    videoId: undefined,
    part: "snippet",
    maxResults: 10,
    pageToken: undefined,
  };

  export var youtubeVideosParams = {
    q:undefined,
    key: YOUTUBE_key,
    part: "snippet",
    type: "video",
    maxResults: maxN,
    videoEmbeddable: true,
    // pageToken: undefined,
  };


export function forceExit(code: number, withError: boolean = true) {
  if (withError) console.error(usageText);
  process.exit(code);
}

//interfaces

export interface Thumbnails {
  [key: string]: {
    url: string;
    width: number;
    height: number;
  };
}

export interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
}

export interface Id {
  kind: string;
  videoId: string;
  channelId: string;
  playlistId: string;
}

export interface Item {
  kind: string;
  etag: string;
  id: Id;
  snippet: Snippet;
}

export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface SearchListResponse {
  query: string;
  kind: string;
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  regionCode: string;
  pageInfo: PageInfo;
  items: Item[];
}

export interface YouTubeCommentsParams {
    key: string | undefined;
    videoId?: string;
    part: string;
    maxResults: number;
    pageToken?: string;
  }

  export interface CommentSnippet {
    channelId: string;
    videoId: string;
    textDisplay: string;
    textOriginal: string;
    authorDisplayName: string;
    authorProfileImageUrl: string;
    authorChannelUrl: string;
    authorChannelId: {
      value: string;
    };
    canRate: boolean;
    viewerRating: string;
    likeCount: number;
    publishedAt: string;
    updatedAt: string;
  }

  
  export interface CommentThread {
    kind: string;
    etag: string;
    id: string;
    snippet: {
      channelId: string;
      videoId: string;
      topLevelComment: CommentSnippet;
      canReply: boolean;
      totalReplyCount: number;
      isPublic: boolean;
    };
  }

  export interface CommentThreadListResponse {
    kind: string;
    etag: string;
    nextPageToken: string;
    pageInfo: {
      totalResults: number;
      resultsPerPage: number;
    };
    items: CommentThread[];
  }

//html

export const headHtml = `
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/ico" href="../favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./styles/style.css">
    <link rel="stylesheet" href="../styles/style-list.css">

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
      integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <title>Project youtube api</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
      integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
  </head>
  `;

export const bodyHtml = (query: string, appList: string) => {
  return `
        <body id="mainBody">
        <header class="header">
        <div class="header-wrapper scroll-reveal colorfull-two">
            <h1 class="header-h1"><span></span>${query}</h1>
            <h2 class="header-h2"><span></span></h2>
        </div>
        <div class="header-back" id="header_back_wrapper">
            <video
            class=""
            autoplay
            muted
            loop
            id="header_back_video"
            data-source="./public/video/live-"
            data-index="0"
            data-maxindex="36"
            >
            <source src="./public/video/live-3.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
            </video>
        </div>
        </header>

        <div class="wrapper">
        <div class="thumbnails">
            <div id="app">
                ${appList}
            </div>
        </div>
        </div>

         <script type="module" src="/src/main.ts"></script>
        </body>
        `;
};

export const createThumbnail = (
  videoId: string,
  videoTitle: string,
  videoThumbnailSrc: string
) => {
  return `
    <a
    id="thumbnailWrapper_${videoId}"
    class="yt-thumbnail-wrapper"
    href="./items/item-page-${videoId}.html"
    ><div
        class="yt-thumbnail"
        id="thumbnail_${videoId}"
        data-id="${videoId}"
    >
        <img
        id="thumbnailImg_${videoId}"
        src="${videoThumbnailSrc}"
        class="yt-thumbnail-img"
        title="${videoTitle}"
        />
        <h3>${videoTitle}</h3>
    </div>
    <div id="thumbnailBg_${videoId}" class="yt-thumbnail-bg"></div
    ></a>
    `;
};

const navItem = `    
<nav>
<section id="nav_logo" class="nav-section">
  <a href="../index.html"><i class="fa-brands fa-youtube"></i></a>
</section>
<section id="nav_link" class="nav-section">
  <a href="#"><i class="fa-solid fa-ghost"></i></a>
  <a href="#"><i class="fa-solid fa-dice-d20"></i></a>
</section>
<section id="nav_other1" class="nav-section">
  <a href="#"><i class="fa-solid fa-microchip"></i></a>
  <a href="#"><i class="fa-solid fa-microchip"></i></a>
  <a href="#"><i class="fa-solid fa-microchip"></i></a>
</section>
<section id="nav_other2" class="nav-section">
  <a href="#"><i class="fa-solid fa-circle-nodes"></i></a>
</section>
</nav>
`;

export const createMainItem = (
  videoId: string,
  index: string,
  show: string,
  title: string,
  date: string,
  description: string,
  comments: string,
  nextVideoId: string,
  preVideoId: string
) => {
  const embeddedUrl = `https://www.youtube.com/embed/${videoId}?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=0`;

  return `
    <article class="m-article" data-index="${index}" data-show="${show}" data-id="${videoId}">
        <section class="article-frame article-section">
        <div class="video-background">
            <iframe
            id="iframe_${videoId}"
            class="yt_player_iframe"
            src="${embeddedUrl}"
            frameborder="0"
            allowfullscreen
            ></iframe>
        </div>
        </section>

        <section class="article-lyric article-section">
        <div id="comments_${videoId}" class="comments-section">
            ${comments}
        </div>
        </section>

        <section class="article-title article-section">
        <div class="at-wrapper-title">
            <h2>  ${title} </h2>
        </div>
        <div class="at-wrapper-description">
            <p>${date} </p>
            <p> ${description} </p>
        </div>
        </section>

        <section class="article-nav article-section">
        <button class="an-btn-left article-button" data-id="${videoId}" data-orientation="left">
            <a class="yt-btn-nav" href="./item-page-${preVideoId}.html">
                <i class="fa-solid fa-arrow-left"></i>
            </a>
        </button>
        <button class="an-btn-right article-button" data-id="${videoId}" data-orientation="right">
            <a class="yt-btn-nav" href="./item-page-${nextVideoId}.html">
                <i class="fa-solid fa-arrow-right"></i>
            </a>
        </button>
        </section>
    </article>
    
    `;
};

export const bodyItem = (mainContent: string, currentIndex: string) => {
  return `
    <div class="body-item">
        ${navItem}
        <main class="list-player" id="main_list_player" data-index=${currentIndex}>
            ${mainContent}
        </main>
    </div>
    `;
};

export const itemFolder = "./items/";

export async function manageFolder(itemFolder: string) {
  try {
    if (fs.existsSync(itemFolder)) {
      const files = fs.readdirSync(itemFolder);
      files.forEach((file) => {
        const route = path.join(itemFolder, file);
        if (fs.lstatSync(route).isDirectory()) {
          manageFolder(route); // recursively delete subdirectories
        } else {
          fs.unlinkSync(route);
        }
      });
    } else {
      fs.mkdirSync(itemFolder, { recursive: true }); // create folder and any necessary subdirectories
    }
  } catch (err) {
    console.error("Error managing folder:", err);
  }
}
