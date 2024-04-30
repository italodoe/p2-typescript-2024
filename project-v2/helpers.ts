export const usageText = `Usage: bun run main.ts [options]

Options:
  -y, --youtube <term>        Search in YouTube for videos related to the specified term
  -h, --help                  Display this help message`;

export const searchUrl: string =
  "https://www.googleapis.com/youtube/v3/search?";
export const getCommentsUrl: string =
  "https://www.googleapis.com/youtube/v3/commentThreads?";
export const maxN = 100;

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
    kind: string;
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    regionCode: string;
    pageInfo: PageInfo;
    items: Item[];
  }