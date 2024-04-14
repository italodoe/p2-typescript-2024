/**
 * Youtube model
 */

import { AppManagement } from "./appmanagement.ts";
import { PageGenerator } from "./pagegenerator.ts";
import { UiManagement } from "./ui.ts";
import {
  getCommentsUrl,
  searchUrl,
  setSearchedClass,
  thumbnail_class_name,
  videoEmbedUrl,
} from "./utils.ts";

/**************************************************************************
 *  interface
 *************************************************************************/
//Search element
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

export interface Item {
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

interface YouTubeCommentParams {
  key: string;
  part: string; //snippet
  type: string;
  videoId: string;
  maxResults: number;
  pageToken?: string | undefined; //plainText
}

//Search List

interface YoutubeServiceParams {
  params: YouTubeSearchParams;
  collection: YoutubeSearchResult[];
  globalValues: YoutubeGlobalValues;
  PageGenerator: PageGenerator;
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
    let that = this;
    this.items.forEach(function (video, index) {
      const videoId = video.id.videoId;
      const snippet = video.snippet;
      const videoTitle = snippet.title;
      // const videoDescription = snippet.description;
      const videoThumbnail = snippet.thumbnails.medium.url; //default|medium|high

      const a = document.createElement("a");
      a.id = `thumbnailWrapper_${videoId}`;
      a.className = thumbnail_class_name.thumbnail_wrapper;
      a.href = "#";

      const div = document.createElement("div");
      div.className = thumbnail_class_name.thumbnail;
      div.id = `thumbnail_${videoId}`;
      // a.href = videoEmbedUrl + videoId;
      div.dataset.id = videoId;

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

      // a.addEventListener("click", that.PageGenerator.pageRender.bind(video));
      a.addEventListener(
        "click",
        that.PageGenerator.pageRender.bind(null, video, that, collection)
      );

      div.append(img);
      div.append(title);
      a.append(div);
      a.append(divBg);
      App.append(a);
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
  commentCollection: [];
  globalValues: YoutubeGlobalValues;
  PageGenerator: PageGenerator;
  // YouTubeComments: YouTubeComments; //TODO remove

  constructor(params: YouTubeSearchParams) {
    this.params = params;
    this.collection = [];
    this.commentCollection = [];
    this.globalValues = {
      g_max_token_call: null,
      g_next_page_token: null,
      g_q: null,
    };
    this.PageGenerator = new PageGenerator();
    // this.YouTubeComments = YouTubeComments; //TODO remove
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

  async callGetCommentsApi(videoId) {
    this.YouTubeComments.callCommentsApi(videoId);
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

      // result.render(App);
      this.render(App, result);

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

  render(App: AppManagement, result) {
    const that = this;

    result.items.forEach(async function (video: Item[], index: number) {
      const videoId = video.id.videoId;
      const snippet = video.snippet;
      const videoTitle = snippet.title;
      // const videoDescription = snippet.description;
      const videoThumbnail = snippet.thumbnails.medium.url; //default|medium|high

      const a = document.createElement("a");
      a.id = `thumbnailWrapper_${videoId}`;
      a.className = thumbnail_class_name.thumbnail_wrapper;
      a.href = "#";

      const div = document.createElement("div");
      div.className = thumbnail_class_name.thumbnail;
      div.id = `thumbnail_${videoId}`;
      // a.href = videoEmbedUrl + videoId;
      div.dataset.id = videoId;

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

      // a.addEventListener("click", that.PageGenerator.pageRender.bind(video));
      a.addEventListener(
        "click",
        that.PageGenerator.pageRender.bind(null, video, that)
      );
      // a.addEventListener("click", that.PageGenerator.pageRender.bind(null, video, that, collection));

      div.append(img);
      div.append(title);
      a.append(div);
      a.append(divBg);
      App.append(a);

    });
  }
}

/**************************************************************************
 *  YoutubeComment
 *************************************************************************/

//Comment list
export interface YouTubeCommentsParams {
  key: string | undefined;
  videoId?: string;
  part: string;
  maxResults: number;
  pageToken?: string;
}

export class YouTubeComments implements YouTubeCommentsParams {
  params: YouTubeCommentsParams;

  constructor(params: YouTubeCommentsParams) {
    this.params = params;
  }

  async callCommentsApi(videoId) {
    console.log(videoId);
    console.log(this.params);
    this.params.videoId = videoId;
    delete this.params.pageToken;

    const body = await fetch(getCommentsUrl + new URLSearchParams(this.params));
    console.log("body", body);
    const response = await body.json();
    console.log("response--Comment", response);
    return response;
  }

  render(elementId:string, response: CommentThreadListResponse){
    const items:CommentThread[] = response.items;
    let html = ``;
    items.forEach(function (item, index) {  
        const snippet = item.snippet.topLevelComment.snippet;
        const author = snippet.authorDisplayName;
        const textOriginal = snippet.textOriginal;
        const textDisplay = snippet.textDisplay;

        html += `<div><p>${author}</p><p>${textOriginal}</p></div>`
        console.log(html);
    });

    console.log('elementId',elementId)
    const box = document.getElementById(elementId);
    console.log('box',box)

    if (box)
      box.innerHTML = html;
  }
}



//comment object
interface CommentSnippet {
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

interface CommentThread {
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

interface CommentThreadListResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: CommentThread[];
}

class Comment {
  constructor(
    public kind: string,
    public etag: string,
    public nextPageToken: string,
    public pageInfo: { totalResults: number; resultsPerPage: number },
    public items: CommentThread[]
  ) {}
}
