const video = document.getElementById('bannerVideo');
const slider = document.getElementById('imageSlider');
let currentIndex = 0;

// เมื่อวิดีโอจบ → แสดงภาพนิ่งแทน
video.addEventListener('ended', () => {
  video.classList.add('hidden');
  slider.classList.remove('hidden');
  startImageSlide();
});

// ฟังก์ชันเปลี่ยนภาพอัตโนมัติ
function startImageSlide() {
  const images = slider.querySelectorAll('img');
  const total = images.length;
  let index = 0;

  // ซ่อนทุกภาพก่อน แสดงภาพแรก
  images.forEach((img, i) => {
    img.style.opacity = i === 0 ? "1" : "0";
    img.style.display = i === 0 ? "block" : "none";
  });

  setInterval(() => {
    // ซ่อนภาพปัจจุบัน
    images[index].style.opacity = "0";
    images[index].style.display = "none";

    // ไปภาพถัดไป
    index = (index + 1) % total;

    // แสดงภาพใหม่
    images[index].style.display = "block";
    images[index].style.opacity = "1";
  }, 4000); // เปลี่ยนทุก 4 วินาที
}
