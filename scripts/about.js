const wrapper = document.querySelector('.slider-wrapper');
let slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0;

function updateSlider() {
  const slideWidth = slides[0].offsetWidth + 30; // รวม padding
  wrapper.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

  slides.forEach((slide, index) => {
    slide.classList.remove('active');
    if (index === currentIndex + 1) { // ตรงกลาง 3 ภาพ
      slide.classList.add('active');
    }
  });
}

// Infinite Loop
function nextSlide() {
  currentIndex++;
  if (currentIndex > slides.length - 3) {
    // clone 3 ภาพแรกต่อท้าย
    for (let i = 0; i < 3; i++) {
      const clone = slides[i].cloneNode(true);
      wrapper.appendChild(clone);
    }
    slides = Array.from(document.querySelectorAll('.slide'));
  }
  updateSlider();
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto-slide ทุก 5 วินาที
let autoSlide = setInterval(nextSlide, 5000);

// เมื่อผู้ใช้กดปุ่ม ให้รีเซ็ต timer
[nextBtn, prevBtn].forEach(btn => {
  btn.addEventListener('click', () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 5000);
  });
});

// เริ่มต้น
updateSlider();
