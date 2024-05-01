import { YOUTUBE_key } from "./env";
import { writeFile } from "fs/promises";

import {
  bodyHtml,
  bodyItem,
  createMainItem,
  createThumbnail,
  getCommentsUrl,
  headHtml,
  headItemHtml,
  itemFolder,
  manageFolder,
  maxN,
  searchUrl,
  youtubeCommentsParams,
  youtubeVideosParams,
  type CommentThread,
  type CommentThreadListResponse,
  type Item,
  type PageInfo,
  type SearchListResponse,
  type YouTubeCommentsParams,
} from "./helpers";

export class YoutubeManager {
  query: string;

  constructor(query: string) {
    this.query = query;
  }

  async generateIndex() {
    const result = await this.getYoutubeSearchResult();
    const indexHtml = await result.render(this.query);
    await writeFile("index.html", indexHtml);
    return indexHtml;
  }

  async getYoutubeSearchResult() {
    const response = await this.callSearchApi();
    return new YoutubeSearchResult(response, this.query);
  }

  async callSearchApi() {
    const params = {
      q: this.query,
      key: YOUTUBE_key,
      part: "snippet",
      type: "video",
      maxResults: maxN,
      videoEmbeddable: true,
      // pageToken: undefined,
    };
    youtubeVideosParams.q = this.query;
    const body = await fetch(
      searchUrl + new URLSearchParams(youtubeVideosParams)
    );
    const response = await body.json();
    return response;
  }
}

export class YoutubeSearchResult implements SearchListResponse {
  query: string;
  kind: string;
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  regionCode: string;
  pageInfo: PageInfo;
  items: Item[];
  YouTubeComments: YouTubeComments;

  constructor(response: SearchListResponse, query: string) {
    this.kind = response.kind;
    this.etag = response.etag;
    this.nextPageToken = response.nextPageToken;
    this.prevPageToken = response.prevPageToken;
    this.regionCode = response.regionCode;
    this.pageInfo = response.pageInfo;
    this.items = response.items;
    this.query = query;
    this.YouTubeComments = new YouTubeComments(youtubeCommentsParams);
  }

  async render(query: string) {
    const list = await this.getListRender();
    const body = bodyHtml(query, list);
    return `
    <!DOCTYPE html>
    <html lang="en" id="html">
        ${headHtml}
        ${body}
        <footer>
    <span class="copyright-sym" id="copyright_sym">C</span>&ensp;
    <span style="line-height: 11px"
      >All Wrongs<br />
      Reserved</span
    >
    </footer>
    </html>
    `;
  }

  renderItemPage(
    indexText: string,
    mainItem: string,
    query: string,
    videoId: string
  ) {
    const body = bodyItem(mainItem, indexText, query, videoId);

    return `
    <!DOCTYPE html>
    <html lang="en" id="html">
        ${headItemHtml}
        <body id="mainBody">
            ${body}
        </body>
    </html>
    `;
  }

  async getListRender() {
    const that = this;
    var html = ``;
    await manageFolder(itemFolder);

    this.items.forEach(async function (video: Item[], index: number, array) {
      const videoId = video.id.videoId;
      const snippet = video.snippet;
      const videoTitle = snippet.title;
      // const videoDescription = snippet.description;
      const videoThumbnail = snippet.thumbnails.medium.url; //default|medium|high
      const videoDescription = video.snippet.description;
      var dt = new Date(video.snippet.publishTime);
      const videoDate = dt.toUTCString();
      //generate index page html
      html += createThumbnail(videoId, videoTitle, videoThumbnail);

      //create item page: html, file
      const nextIndex = index + 1 >= array.length ? 0 : index + 1;
      const previousIndex = index === 0 ? array.length - 1 : index - 1;
      const nextVideoId = array[nextIndex].id.videoId;
      const preVideoId = array[previousIndex].id.videoId;
      const comments = await that.YouTubeComments.createCommentItem(videoId);
      const mainItem = createMainItem(
        videoId,
        String(index),
        "1",
        videoTitle,
        videoDate,
        videoDescription,
        comments,
        nextVideoId,
        preVideoId
      );
      const indexText = `${index + 1} / ${array.length} `;
      const itemRender = that.renderItemPage(
        indexText,
        mainItem,
        that.query,
        videoId
      );
      const filename = itemFolder + `item-page-${videoId}.html`;
      await writeFile(filename, itemRender);
    });

    return html;
  }
}

export class YouTubeComments {
  params: YouTubeCommentsParams;

  constructor(params: YouTubeCommentsParams) {
    this.params = params;
  }

  async createCommentItem(videoId: string) {
    const commentResponse = await this.callCommentsApi(videoId);
    return this.render(videoId, commentResponse);
  }

  async callCommentsApi(videoId: string) {
    this.params.videoId = videoId;
    delete this.params.pageToken;

    const body = await fetch(getCommentsUrl + new URLSearchParams(this.params));

    if (body.status === 200) {
      const response = await body.json();
      return response;
    }
    return null;
  }

  render(elementId: string, response: CommentThreadListResponse) {
    let html = `<p>No Comments allowed for this video</p>`;
    if (response) {
      const items: CommentThread[] = response.items;
      html = `<div class="comments">`;
      items.forEach(function (item: any, index: number) {
        const snippet = item.snippet.topLevelComment.snippet;
        const author = snippet.authorDisplayName;
        const textOriginal = snippet.textOriginal;
        const textDisplay = snippet.textDisplay;

        html += `<div class="comment-wrapper"><p class=comment-author>${author}</p><p class="comment-text">${textOriginal}</p></div>`;
      });
      html += `</div>`;
    }

    return html;
  }
}
