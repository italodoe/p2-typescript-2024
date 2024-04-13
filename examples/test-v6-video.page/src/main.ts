import "./style.css";

console.log("run");
var activeIndex = 0;
const slides = document.querySelectorAll(".m-article");
const leftBtns = document.querySelectorAll(".an-btn-left");
const rightBtns = document.querySelectorAll(".an-btn-right");

if (leftBtns) {
  leftBtns.forEach(function (item, index) {
    console.log('leftBtns', item, index);
    item.addEventListener("click", handleClickLeft, false);
  });
}
if (rightBtns) {
  rightBtns.forEach(function (item, index) {
    console.log(item, index);
    item.addEventListener("click", handleClickRight, false);

  });
}

function handleClickLeft(e: Event) {
  console.log("handleClickLeft", this);
  const item = this;
  const nextIndex = activeIndex - 1 < 0 ? 0 : activeIndex - 1;

  const currentSlide = document.querySelector(`[data-index="${activeIndex}"]`);
  const nextSlide = document.querySelector(`[data-index="${nextIndex}"]`);
  if (nextSlide) nextSlide.dataset.show = "1";
  if (currentSlide) currentSlide.dataset.show = "0";
  activeIndex = nextIndex;
}

function handleClickRight(e: Event) {
  console.log("handleClickRight", this);
  const item = this;
  const nextIndex = activeIndex + 1 === slides.length ? activeIndex : activeIndex + 1;
  const currentSlide = document.querySelector(`[data-index="${activeIndex}"]`);
  const nextSlide = document.querySelector(`[data-index="${nextIndex}"]`);


  if (nextSlide) nextSlide.dataset.show = "1";
  if (currentSlide) currentSlide.dataset.show = "0";
  activeIndex = nextIndex;

}
