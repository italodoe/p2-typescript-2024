import { AppManagement } from "./appmanagement.ts";
const videoEmbedUrl = "https://www.youtube.com/embed/";

/**
 * Youtube model
 */

interface Thumbnails {
    [key: string]: {
      url: string;
      width: number;
      height: number;
    };
  }
  
  interface Id {
    kind: string;
    videoId: string;
    channelId: string;
    playlistId: string;
  }
  
  interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    liveBroadcastContent: string;
  }
  
  interface Item {
    kind: string;
    etag: string;
    id: Id;
    snippet: Snippet;
  }
  
  interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
  }
  
  interface SearchListResponse {
    kind: string;
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    regionCode: string;
    pageInfo: PageInfo;
    items: Item[];
  }
  
  export class YoutubeSearchResult implements SearchListResponse {
    kind: string;
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    regionCode: string;
    pageInfo: PageInfo;
    items: Item[];
    constructor(response: SearchListResponse) {
      this.kind = response.kind;
      this.etag = response.etag;
      this.nextPageToken = response.nextPageToken;
      this.prevPageToken = response.prevPageToken;
      this.regionCode = response.regionCode;
      this.pageInfo = response.pageInfo;
      this.items = response.items;
    }
  
    render(App: AppManagement, clear: boolean = true) {
      if (clear) App.clear();
  
      this.items.forEach(function (video, index) {
        const videoId = video.id.videoId;
        const snippet = video.snippet;
        const videoTitle = snippet.title;
        // const videoDescription = snippet.description;
        const videoThumbnail = snippet.thumbnails.medium.url; //default|medium|high
  
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
        App.append(div);
  
        
      });
    }
  }
  