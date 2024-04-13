/**
 * Youtube model
 */

import { AppManagement } from "./appmanagement.ts";
import {
  searchUrl,
  setSearchedClass,
  thumbnail_class_name,
  videoEmbedUrl,
} from "./utils.ts";

/**************************************************************************
 *  interface
 *************************************************************************/

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

interface YoutubeGlobalValues {
  g_max_token_call: number | null;
  g_next_page_token: string | null;
  g_q: string | null;
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

interface YouTubeSearchParams {
  q: string;
  key: string;
  part: string;
  type: string;
  maxResults: number;
  videoEmbeddable: boolean;
  pageToken?: string | undefined;
}

interface YoutubeServiceParams {
  params: YouTubeSearchParams;
  collection: YoutubeSearchResult[];
  globalValues: YoutubeGlobalValues;
}

/**************************************************************************
 *  YoutubeSearchResult
 *************************************************************************/

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

  //render

  render(App: AppManagement) {
    this.items.forEach(function (video, index) {
      const videoId = video.id.videoId;
      const snippet = video.snippet;
      const videoTitle = snippet.title;
      // const videoDescription = snippet.description;
      const videoThumbnail = snippet.thumbnails.medium.url; //default|medium|high

      const div = document.createElement("div");
      div.id = `thumbnailWrapper_${videoId}`;
      div.className = thumbnail_class_name.thumbnail_wrapper;

      const a = document.createElement("a");
      a.className = thumbnail_class_name.thumbnail;
      a.id = `thumbnail_${videoId}`;
      a.href = videoEmbedUrl + videoId;

      const img = document.createElement("img");
      img.id = `thumbnailImg_${videoId}`;
      img.src = videoThumbnail;
      img.className = thumbnail_class_name.thumbnail_img;

      img.title = videoTitle;

      const title = document.createElement("h3");
      title.textContent = videoTitle;

      const divBg = document.createElement("div");
      divBg.id = `thumbnailBg_${videoId}`;
      divBg.className = thumbnail_class_name.thumbnail_bg;

      a.append(img);
      a.append(title);
      div.append(a);
      div.append(divBg);
      App.append(div);
    });
  }
}

/**************************************************************************
 *  YoutubeService
 *************************************************************************/

export class YoutubeService implements YoutubeServiceParams {
  static maxLoads: number = 5;
  params: YouTubeSearchParams;
  collection: YoutubeSearchResult[];
  globalValues: YoutubeGlobalValues;

  constructor(params: YouTubeSearchParams) {
    this.params = params;
    this.collection = [];
    this.globalValues = {
      g_max_token_call: null,
      g_next_page_token: null,
      g_q: null,
    };
  }

  //statics
  static get _maxLoads(): number {
    return this.maxLoads;
  }

  //getters
  get g_max_token_call(): number | null {
    return this.globalValues.g_max_token_call;
  }
  get g_next_page_token(): string | null {
    return this.globalValues.g_next_page_token;
  }
  get g_q(): string | null {
    return this.globalValues.g_q;
  }

  //setters
  set _g_max_token_call(value: number | null) {
    this.globalValues.g_max_token_call = value;
  }
  set _g_next_page_token(value: string | null) {
    this.globalValues.g_next_page_token = value;
  }
  set _g_q(value: string | null) {
    this.globalValues.g_q = value;
  }
  cleanGlobal() {
    this._g_max_token_call = null;
    this._g_next_page_token = null;
    this._g_q = null;
  }

  async callSearchApi() {
    const body = await fetch(searchUrl + new URLSearchParams(this.params));
    const response = await body.json();
    console.log("response--", response);
    return response;
  }

  async search(App: AppManagement, q: string | null = null) {
    const maxTokenCall: number | null = this.g_max_token_call;
    let _maxTokenCallInt = maxTokenCall ? maxTokenCall : -1;
    let _q: string | null;
    let canLoad = YoutubeService._maxLoads >= _maxTokenCallInt;

    if (q == null) {
      //get next page
      _q = this.g_q;
    } else {
      //get from query
      //new search
      this.cleanGlobal();
      _q = q;
      canLoad = true;
    }

    if (_q && canLoad) {
      this.params.q = _q;
      delete this.params.pageToken;
      const _nextPageToken = this.g_next_page_token;

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

      // set class for video background
      setSearchedClass(true);

      // set globals
      this._g_next_page_token = response.nextPageToken;
      this._g_q = _q;
      this._g_max_token_call = ++_maxTokenCallInt;

      return true;
    }

    return false;
  }
}
