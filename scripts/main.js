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



document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.review-track');
  const cards = Array.from(track.children);
  const speed = 0.3; // ⬅️ ปรับได้: ยิ่งเลขน้อยยิ่งช้า

  // 🔁 clone เพื่อทำลูปต่อเนื่อง
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  let pos = 0;
  function animate() {
    pos -= speed;
    // รีเซ็ตเมื่อเลื่อนไปเกินครึ่งของเนื้อหา
    if (Math.abs(pos) >= track.scrollWidth / 2) {
      pos = 0;
    }
    track.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(animate);
  }
  animate();
});



!function (f, b, e, v, n, t, s) {
  if (f.fbq) return; n = f.fbq = function () {
    n.callMethod ?
    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
  };
  if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
  n.queue = []; t = b.createElement(e); t.async = !0;
  t.src = v; s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s)
}(window, document, 'script',
  'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '854274463843491');
fbq('track', 'PageView');

<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=854274463843491&ev=PageView&noscript=1"
/></noscript>
