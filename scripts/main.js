const video = document.getElementById('bannerVideo');
const fallback = document.getElementById('fallbackImage');


video.addEventListener('ended', () => {
  video.currentTime = 0; // ย้อนเวลาไปเริ่มต้น
  video.play();           // เล่นใหม่
});


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
