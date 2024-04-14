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
  <a href="#"><i class="fa-brands fa-youtube"></i></a>
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

  async pageRender(...args) {
    // const event = args.pop();
    // console.log(event.target);
    console.log("args: ", args);
    // console.log(e);
    console.log(this);

    // const Video:  = args[1];
    console.log("pageRender0", args[0]);
    console.log("pageRender1", args[1]);
    console.log("pageRender2", args[2]);

    const videoClicked: Item = args[0];
    const collection: [] = args[1].collection;
    var articles = ``;
    var buttons = [];
    var currentIndex = 0;

    collection.forEach(function (searchItem, index) {
      console.log("collection->>item", searchItem);

      searchItem.items.forEach(function (video, index) {
        console.log("collection->>item", video);
        const videoId = video.id.videoId;
        const lyric = ``; //TODO
        const title = video.snippet.title;
        const description = video.snippet.description;
        let show = 0;
        if(videoId === videoClicked.id.videoId ){
          show = videoId === videoClicked.id.videoId ? 1 : 0;
          currentIndex = index;
        }
        const embeddedUrl = `https://www.youtube.com/embed/${videoId}?controls=0&showinfo=0&rel=0&autoplay=${show}&loop=1&mute=0`;

        // const thumbnail = video.snippet.thumbnails.medium;
        articles += `
          <article class="m-article" data-index="${index}" data-show="${show}">
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
              <p> ${lyric} </p>
              </section>

              <section class="article-title article-section">
              <div class="at-wrapper-title">
                  <h2>  ${title} </h2>
              </div>
              <div class="at-wrapper-description">
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

    console.log(html);
    const body = document.getElementById("mainBody");
    if (body){
       body.innerHTML = html;
       const buttons = body.querySelectorAll(`.article-button`);
       buttons.forEach(function (item, index) {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          console.log(e);

          const videoId = item.dataset.id;
          const orientation = item.dataset.orientation;

          const main: HTMLElement = document.getElementById(`main_list_player`)
          const currentIndex = parseInt(main.dataset.index);
          const iframe: HTMLIFrameElement = document.getElementById(`iframe_${videoId}`)
          const slides = document.querySelectorAll(`.m-article`);

          if (iframe){
            const src = iframe.src;
            const embeddedUrl = `https://www.youtube.com/embed/${videoId}?controls=0&showinfo=0&rel=0&autoplay=0&loop=1&mute=0`;
            iframe.src = embeddedUrl;
            console.log(iframe)
          }
          var nextIndex ,currentSlide, nextSlide

          if (orientation === "left"){
            console.log('left');
            nextIndex = (currentIndex - 1 < 0) ? 0 : (currentIndex - 1);
            currentSlide = document.querySelector(`.m-article[data-index="${currentIndex}"]`);
            nextSlide = document.querySelector(`.m-article[data-index="${nextIndex}"]`);
          }
          else{ //right
            console.log('right',slides);
            nextIndex = currentIndex + 1 === slides.length ? currentIndex : currentIndex + 1;
            currentSlide = document.querySelector(`.m-article[data-index="${currentIndex}"]`);
            nextSlide = document.querySelector(`.m-article[data-index="${nextIndex}"]`);
          }

          if (nextSlide) nextSlide.dataset.show = "1";
          if (currentSlide) currentSlide.dataset.show = "0";
          main.dataset.index = nextIndex;

    
        })
      });

    }
    
  }
}
