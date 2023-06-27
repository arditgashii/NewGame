//SlideShow JS
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide(n) {
  slides.forEach((slide) => {
    slide.classList.remove('active');
  });

  slides[n].classList.add('active');
}

function nextSlide() {
  showSlide(currentSlide);
  currentSlide = (currentSlide + 1) % slides.length;
}

showSlide(currentSlide);

setInterval(nextSlide, 3000);