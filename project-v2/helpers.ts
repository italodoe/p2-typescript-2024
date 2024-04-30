export const usageText = `Usage: bun run main.ts [options]

Options:
  -y, --youtube <term>        Search in YouTube for videos related to the specified term
  -h, --help                  Display this help message`;

export const searchUrl: string =
  "https://www.googleapis.com/youtube/v3/search?";
export const getCommentsUrl: string =
  "https://www.googleapis.com/youtube/v3/commentThreads?";
export const maxN = 10;

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

//html

export const headHtml = `
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/ico" href="./favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./styles/style.css">

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
    href="#"
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
