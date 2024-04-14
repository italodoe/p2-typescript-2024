import { AppManagement } from "./appmanagement.ts";
import {
  search_form,
  search_input,
  videoBg,
  copyright_sym,
  intervalBgTime,
} from "./utils.ts";
import { App, YoutubeSrv } from "./utils.ts";
import { YoutubeService } from "./youtubemodel.ts";

export class UiManagement {
  searchForm: HTMLFormElement;
  searchInput: HTMLInputElement;
  App: AppManagement;
  YoutubeSrv: YoutubeService;
  interval: Timeout ;
  videoBgArrayIndex: number[] = [];
  currentTimeOffset: number;
  scrollOffset: number; //px
  isIntervalActive: boolean; //px

  constructor() {
    this.App = App;
    this.YoutubeSrv = YoutubeSrv;
    this.searchForm = search_form;
    this.searchInput = search_input;
    this.scrollOffset = 2;
    this.isIntervalActive = false;
    this.currentTimeOffset = 0;

    //Interval background
    this.interval = setInterval(() => {
      this.changeBackgroundVideo();
    }, intervalBgTime);
  }

  initListeners() {
    //listener for search submit
    this.searchForm.addEventListener("submit", this.searchHandler.bind(this));
    //listener for scroll load
    window.addEventListener(
      "scroll",
      this.infinityScrollHandler.bind(this),
      false
    );
  }

  async searchHandler(e: SubmitEvent) {
    e.preventDefault();
    const _q = search_input?.value;
    if (_q) {
      this.App.clear();
      this.YoutubeSrv.search(this.App, _q);
    }
  }

  async infinityScrollHandler(e: Event) {
    e.preventDefault();
    const { clientHeight, scrollHeight, scrollTop } = document.documentElement;

    const searcher = document.getElementById("search_input");
    if (searcher && scrollTop + clientHeight > scrollHeight - this.scrollOffset) {
      copyright_sym?.classList.add("searching");
      await YoutubeSrv.search(App, null);
      copyright_sym?.classList.remove("searching");
    }
  }

  changeBackgroundVideo = () => {
    this.isIntervalActive = true;
    const videoSource = videoBg?.dataset.source;
    const videoMaxIndex = videoBg?.dataset.maxindex;
    const maxTimeOffset = 20; //seconds
    const timeOffset = 2;

    if (videoMaxIndex) {
      if (this.videoBgArrayIndex.length === 0) {
        this.videoBgArrayIndex = Array.from(
          Array(parseInt(videoMaxIndex)).keys()
        );

        this.videoBgArrayIndex.sort(() => 0.5 - Math.random());
        this.currentTimeOffset += timeOffset;

        if (this.currentTimeOffset > maxTimeOffset) {
          this.currentTimeOffset = 0;
        }
      }
      videoBg.src = videoSource + String(this.videoBgArrayIndex.pop()) + ".mp4";
      //   videoBg.currentTime = this.currentTimeOffset;
    }
  };

}
