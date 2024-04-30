import { YOUTUBE_key } from "./env";
import { writeFile } from "fs/promises";

import {
  bodyHtml,
  createThumbnail,
  headHtml,
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
    const indexHtml = result.render(this.query);
    const filename = "index.html";
    await writeFile(filename, indexHtml);
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

  render(query: string) {
    const list = this.getListRender();
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

  getListRender() {
    const that = this;
    var html = ``;

    this.items.forEach(function (video: Item[], index: number) {
      const videoId = video.id.videoId;
      const snippet = video.snippet;
      const videoTitle = snippet.title;
      // const videoDescription = snippet.description;
      const videoThumbnail = snippet.thumbnails.medium.url; //default|medium|high
      html += createThumbnail(videoId, videoTitle, videoThumbnail);
    });

    return html;
  }
}
