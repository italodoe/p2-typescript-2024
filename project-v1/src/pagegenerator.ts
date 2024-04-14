// import { promises as fs } from 'fs';

import { Item } from "./youtubemodel";

const head = `  
<head>
<meta charset="UTF-8" />
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
  integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
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

  async pageRender(e: Event) {
    const video: Item = this;

    console.log(e);
    console.log(this);

    const videoId = video.id.videoId;
    const embeddedUrl = `https://www.youtube.com/embed/${videoId}?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=0`;
    const lyric = ``; //TODO
    const title = video.snippet.title;
    const description = video.snippet.description;
    const thumbnail = video.snippet.thumbnails.medium;

    var articles = `
    <article class="m-article" data-index="0" data-show="1">
        <section class="article-frame article-section">
        <div class="video-background">
            <iframe
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
        <button class="an-btn-left article-button">
            <i class="fa-solid fa-arrow-left"></i>
        </button>
        <button class="an-btn-right article-button">
            <i class="fa-solid fa-arrow-right"></i>
        </button>
        </section>
    </article>
    `;

    const html = `<!DOCTYPE html>
    <html lang="en">
        ${head} 
        <body class="body-item">
            ${nav}
            <main>
                ${articles}
            </main>
        </body>
    </html>`;
  }
}
