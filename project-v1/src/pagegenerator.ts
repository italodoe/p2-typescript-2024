import { YouTubeComment } from "./utils";
import { Item, YoutubeService } from "./youtubemodel";

const head = `  
<head>
<meta charset="UTF-8" />
<!--<link rel="icon" type="image/svg+xml" href="/vite.svg" />-->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
  integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
<link rel="stylesheet" src="/src/style-list.css">
<title>Video list</title>
</head>
`;

const nav = `    
<nav>
<section id="nav_logo" class="nav-section">
  <a href="/"><i class="fa-brands fa-youtube"></i></a>
</section>
<section id="nav_link" class="nav-section">
  <a href="#"><i class="fa-solid fa-ghost"></i></a>
  <a href="#"><i class="fa-solid fa-dice-d20"></i></a>
</section>
<section id="nav_other1" class="nav-section">
  <a href="#"><i class="fa-solid fa-microchip"></i></a>
  <a href="#"><i class="fa-solid fa-microchip"></i></a>
  <a href="#"><i class="fa-solid fa-microchip"></i></a>
</section>
<section id="nav_other2" class="nav-section">
  <a href="#"><i class="fa-solid fa-circle-nodes"></i></a>
</section>
</nav>
`;

export class PageGenerator {
  status: boolean;

  constructor() {
    this.status = false;
  }

  async pageRender(...args: any) {
    const videoClicked: Item = args[0];
    const collection: [] = args[1].collection;
    var articles = ``;
    var currentIndex = 0;
    var currentVideoId = 0;

    collection.forEach(function (searchItem: any, indexOne: number) {
      // continue index
      const items: [] = searchItem.items;
      const currentSlidesLength = indexOne * items.length;

      items.forEach(function (video: any, index: number) {
        const _index = currentSlidesLength + index;
        const videoId = video.id.videoId;
        const lyric = ``; //TODO

        const title = video.snippet.title;
        const description = video.snippet.description;
        var dt = new Date(video.snippet.publishTime);
        const date = dt.toUTCString();

        let show = 0;
        if (videoId === videoClicked.id.videoId) {
          show = videoId === videoClicked.id.videoId ? 1 : 0;
          currentIndex = _index;
          currentVideoId = videoId;
        }
        const embeddedUrl = `https://www.youtube.com/embed/${videoId}?controls=0&showinfo=0&rel=0&autoplay=${show}&loop=1&mute=0`;
        // const thumbnail = video.snippet.thumbnails.medium;

        articles += ` 
          <article class="m-article" data-index="${_index}" data-show="${show}" data-id="${videoId}">
              <section class="article-frame article-section">
              <div class="video-background">
                  <iframe
                  id="iframe_${videoId}"
                  class="yt_player_iframe"
                  src="${embeddedUrl}"
                  frameborder="0"
                  allowfullscreen
                  ></iframe>
              </div>
              </section>

              <section class="article-lyric article-section">
              <div id="comments_${videoId}"> </div>
              </section>

              <section class="article-title article-section">
              <div class="at-wrapper-title">
                  <h2>  ${title} </h2>
              </div>
              <div class="at-wrapper-description">
                  <p>${date} </p>
                  <p> ${description} </p>
              </div>
              </section>

              <section class="article-nav article-section">
              <button class="an-btn-left article-button" data-id="${videoId}" data-orientation="left">
                  <i class="fa-solid fa-arrow-left"></i>
              </button>
              <button class="an-btn-right article-button" data-id="${videoId}" data-orientation="right">
                  <i class="fa-solid fa-arrow-right"></i>
              </button>
              </section>
          </article>
          `;
      });
    });

    const html = `
          <div class="body-item">
            ${nav}
            <main class="list-player" id="main_list_player" data-index=${currentIndex}>
                ${articles}
            </main></div>`;

    const body = document.getElementById("mainBody");

    if (body) {
      body.innerHTML = html;
      const commentResponse = await YouTubeComment.callCommentsApi(
        currentVideoId
      );
      YouTubeComment.render(`comments_${currentVideoId}`, commentResponse);

      const buttons = body.querySelectorAll(`.article-button`);
      buttons.forEach(function (item: any, index: number) {
        item.addEventListener("click", async function (e: Event) {
          e.preventDefault();

          const videoId = item.dataset.id;
          const orientation = item.dataset.orientation;
          const iframe: HTMLIFrameElement | null = document.getElementById(
            `iframe_${videoId}`
          );
          const slides = document.querySelectorAll(`.m-article`);

          const main: HTMLElement | null =
            document.getElementById(`main_list_player`);

          if (iframe) {
            const src = iframe.src;
            const embeddedUrl = `https://www.youtube.com/embed/${videoId}?controls=0&showinfo=0&rel=0&autoplay=0&loop=1&mute=0`;
            iframe.src = embeddedUrl;
          }
          var nextIndex, currentSlide, nextSlide;

          if (main) {
            const currentIndex = parseInt(main.dataset.index);

            if (orientation === "left") {
              nextIndex =
                currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;
              currentSlide = document.querySelector(
                `.m-article[data-index="${currentIndex}"]`
              );
              nextSlide = document.querySelector(
                `.m-article[data-index="${nextIndex}"]`
              );
            } else {
              //right
              nextIndex =
                currentIndex + 1 === slides.length ? 0 : currentIndex + 1;
              currentSlide = document.querySelector(
                `.m-article[data-index="${currentIndex}"]`
              );
              nextSlide = document.querySelector(
                `.m-article[data-index="${nextIndex}"]`
              );
            }

            if (nextSlide) {
              nextSlide.dataset.show = "1";
              const nextVideoId = nextSlide.dataset.id;
              const nextIframe: HTMLIFrameElement = document.getElementById(
                `iframe_${nextVideoId}`
              );
              const nextEmbeddedUrl = `https://www.youtube.com/embed/${nextVideoId}?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=0`;
              nextIframe.src = nextEmbeddedUrl;

              const commentResponse = await YouTubeComment.callCommentsApi(
                videoId
              );
              YouTubeComment.render(`comments_${nextVideoId}`, commentResponse);
            }

            if (currentSlide) 
              currentSlide.dataset.show = "0";
            main.dataset.index = nextIndex;
          }
        });
      });
    }
  }
}
