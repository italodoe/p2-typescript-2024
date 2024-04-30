import { YOUTUBE_key } from "./env";
import { writeFile } from "fs/promises";

import {
  bodyHtml,
  bodyItem,
  createMainItem,
  createThumbnail,
  headHtml,
  itemFolder,
  manageFolder,
  maxN,
  searchUrl,
  type Item,
  type PageInfo,
  type SearchListResponse,
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

    const body = await fetch(searchUrl + new URLSearchParams(params));
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

  constructor(response: SearchListResponse, query: string) {
    this.kind = response.kind;
    this.etag = response.etag;
    this.nextPageToken = response.nextPageToken;
    this.prevPageToken = response.prevPageToken;
    this.regionCode = response.regionCode;
    this.pageInfo = response.pageInfo;
    this.items = response.items;
    this.query = query;
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

  renderItemPage(videoId: string, mainItem: string) {
    const body = bodyItem(mainItem, "2");

    return `
    <!DOCTYPE html>
    <html lang="en" id="html">
        ${headHtml}
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
      const previousIndex = index + -1 < 0 ? 0 : index - 1;
      const nextVideoId = array[nextIndex].id.videoId;
      const preVideoId = array[nextIndex].id.videoId;
      const mainItem = createMainItem(
        videoId,
        String(index),
        "1",
        videoTitle,
        videoDate,
        videoDescription,
        nextVideoId,
        preVideoId
      );
      const itemRender = that.renderItemPage(videoId, mainItem);
      const filename = itemFolder + `item-page-${videoId}.html`;
      await writeFile(filename, itemRender);
    });

    return html;
  }
}
