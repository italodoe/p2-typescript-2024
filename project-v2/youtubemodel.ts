import { YOUTUBE_key } from "./env";
import {
  maxN,
  searchUrl,
  type Item,
  type PageInfo,
  type SearchListResponse,
} from "./helpers";

export async function getYoutubeVideosList(query: string) {
  const response = await callSearchApi(query);
  const result = new YoutubeSearchResult(response);

  console.log("result", result);
  return result;
}

async function callSearchApi(query: string) {
  const params = {
    q: query,
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

}
