import { AppManagement } from "./appmanagement.ts";
import { YOUTUBE_key } from "./env.ts";
import { LocalStorageManagement } from "./localstoragemanagement.ts";
import { YoutubeService } from "./youtubemodel.ts";

//YoutubeService : YoutubeSrv
export const default_youtube_param = {
  q: "",
  key: YOUTUBE_key,
  part: "snippet",
  type: "video",
  maxResults: 10,
  videoEmbeddable: true,
  pageToken: undefined,
};
export const YoutubeSrv = new YoutubeService(default_youtube_param);

//AppManagement: App
export const app_element = <HTMLElement>document.getElementById("app");
export const App = new AppManagement(app_element);

//LocalStorageManagement: localKeyArray
export const key_max_token_call = "max_token_call";
export const key_next_page_token = "next_page_token";
export const key_q = "q";
export const localKeyArray: string[] = [
  key_q,
  key_next_page_token,
  key_max_token_call,
];
export const LocalStorage = new LocalStorageManagement(localKeyArray);

//Form, input, button, span, div
export const search_form = <HTMLFormElement>(
  document.getElementById("search_form")
);
export const search_input = <HTMLInputElement>(
  document.getElementById("search_input")
);

export const copyright_sym = <HTMLElement>(
  document.getElementById("copyright_sym")
);
export const videoBg = <HTMLVideoElement>(
  document.getElementById("header_back_video")
);

//interval time for background video change
export const intervalBgTime = 7400; //ms

//className for active search
export const searchClassName = "searched";
export const headerBgWrapper = <HTMLElement>(
  document.getElementById("header_back_wrapper")
);
export function setSearchedClass(active: boolean = true) {
  if (active) headerBgWrapper?.classList.add(searchClassName);
  else headerBgWrapper?.classList.remove(searchClassName);
}

//youtube urls
export const videoEmbedUrl: string = "https://www.youtube.com/embed/";
export const searchUrl: string =
  "https://www.googleapis.com/youtube/v3/search?";

export const thumbnail_class_name = {
  thumbnail_wrapper: "yt-thumbnail-wrapper",
  thumbnail: "yt-thumbnail",
  thumbnail_img: "yt-thumbnail-img",
  thumbnail_bg: "yt-thumbnail-bg",
};
