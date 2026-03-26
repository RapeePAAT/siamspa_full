/* ============================================
   SIAM SPA – main.js (Updated)
   ============================================ */

/* ── Banner: Video → Image Slider ── */
const video = document.getElementById('bannerVideo');
const slider = document.getElementById('imageSlider');

if (video && slider) {
  video.addEventListener('ended', () => {
    video.classList.add('hidden');
    slider.classList.remove('hidden');
    startImageSlide();
  });
}

function startImageSlide() {
  const images = slider.querySelectorAll('img');
  const total = images.length;
  let index = 0;

  images.forEach((img, i) => {
    img.style.opacity = i === 0 ? '1' : '0';
    img.style.display = 'block';
  });

  setInterval(() => {
    images[index].style.opacity = '0';
    index = (index + 1) % total;
    images[index].style.opacity = '1';
  }, 4500);
}

/* ── Review Slider: Infinite Scroll ── */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.review-track');
  if (track) {
    const cards = Array.from(track.children);
    const speed = 0.28;

    // Clone for seamless loop
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    let pos = 0;
    let paused = false;

    // Pause on hover
    track.addEventListener('mouseenter', () => paused = true);
    track.addEventListener('mouseleave', () => paused = false);

    function animate() {
      if (!paused) {
        pos -= speed;
        if (Math.abs(pos) >= track.scrollWidth / 2) {
          pos = 0;
        }
        track.style.transform = `translateX(${pos}px)`;
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ── Scroll Reveal: IntersectionObserver ── */
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (revealEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Animate once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealEls.forEach(el => observer.observe(el));
  }
});

/* ── Facebook Pixel ── */
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