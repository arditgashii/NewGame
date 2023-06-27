let slideIndex = 0;
const slides = document.querySelectorAll('.video-slide');

function showSlide(index) {
  if (index < 0) {
    slideIndex = slides.length - 1;
  } else if (index >= slides.length) {
    slideIndex = 0;
  }

  slides.forEach((slide, index) => {
    if (index === slideIndex) {
      slide.classList.add('active'); // Add the "active" class to the current slide
      slide.play(); // Start playing the selected video
    } else {
      slide.classList.remove('active'); // Remove the "active" class from other slides
      slide.pause(); // Pause other videos
    }
  });
}

function changeSlide(n) {
  slideIndex += n;
  showSlide(slideIndex);
}

showSlide(slideIndex);
