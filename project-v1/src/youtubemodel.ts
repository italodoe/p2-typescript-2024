import { AppManagement } from "./appmanagement.ts";
import { LocalStorageManagement } from "./localstoragemanagement.ts";

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

  render(App: AppManagement) {
    // if (clear) App.clear();

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
      a.href = YoutubeService._embedUrl + videoId;

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

interface YouTubeSearchParams {
  q: string;
  key: string;
  part: string;
  type: string;
  maxResults: number;
  videoEmbeddable: boolean;
  pageToken?: string | undefined;
}

export class YoutubeService {
  static videoEmbedUrl: string = "https://www.youtube.com/embed/";
  static searchUrl: string = "https://www.googleapis.com/youtube/v3/search?";

  static maxLoads: number = 5;
  params: YouTubeSearchParams;
  collection: YoutubeSearchResult[] = [];

  constructor(params: YouTubeSearchParams) {
    this.params = params;
  }

  static get _embedUrl(): string {
    return this.videoEmbedUrl;
  }
  static get _searchUrl(): string {
    return this.searchUrl;
  }
  static get _maxLoads(): number {
    return this.maxLoads;
  }

  async callSearchApi() {
    const body = await fetch(
      YoutubeService._searchUrl + new URLSearchParams(this.params)
    );
    const response = await body.json();
    console.log("response--", response);
    return response;
  }

  async search(
    App: AppManagement,
    LocalStorage: LocalStorageManagement,
    q: string | null = null
  ) {
    const maxTokenCall = LocalStorage.getLocalStorageItem("max_token_call");
    let _maxTokenCallInt = maxTokenCall ? parseInt(maxTokenCall) : -1;
    let _q: string;
    let canLoad = YoutubeService._maxLoads >= _maxTokenCallInt;

    if (q == null) {
      //get next page
      _q = LocalStorage.getLocalStorageItem("q");
    } else {
      //get from query
      //new search
      LocalStorage.clearLocalStorage();
      _q = q;
      canLoad = true;
    }

    if (_q && canLoad) {
      this.params.q = _q;
      delete this.params.pageToken;
      const _nextPageToken =
        LocalStorage.getLocalStorageItem("next_page_token");

      let clear = true;
      if (_nextPageToken) {
        this.params.pageToken = _nextPageToken;
        clear = false;
      } else {
        this.collection = [];
      }
      const response = await this.callSearchApi();
      const result = new YoutubeSearchResult(response);
      this.collection.push(result);
      result.render(App);

      //todo refactoring to an class
      const searchClassName = "searched";
      const bg = document.getElementById("header_back_wrapper");
      bg?.classList.add(searchClassName);
      //
      //todo move string to const
      LocalStorage.setLocalStorageItem(
        "next_page_token",
        response.nextPageToken
      );
      LocalStorage.setLocalStorageItem("q", _q);
      LocalStorage.setLocalStorageItem("max_token_call", ++_maxTokenCallInt);
      return true;
    }

    return false;
  }
}
